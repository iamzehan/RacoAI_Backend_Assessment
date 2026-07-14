import { PaymentProvider, PaymentStatus } from "../generated/prisma/enums.js";
import { PaymentFactory } from "../payment/payment.factory.js";
import { PaymentRepository } from "../repositories/payment.repository.js";
import { Request } from "express";
import { stripe } from "../payment/clients/stripe.client.js";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { OrderService } from "./order.service.js";
import { Order } from "../generated/prisma/client.js";

export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly orderService: OrderService
  ) {}

  /**
   * Initiate a payment.
   */
  async initiate(data: {
    userId: string;
    orderId: string;
    provider: PaymentProvider;
    amount: number;
  }) {
    // Verify order ownership from order table 
    const order = await this.orderService.readOne({id: data.orderId});

    if (!order) {
      throw new Error("Order not found.");
    }
    if (order.userId !== data.userId) {
      throw new Error("Unauthorized access.");
    }

    // Create pending payment record
    const payment = await this.paymentRepo.create({
      orderId: data.orderId,
      provider: data.provider,
      amount: data.amount
    });

    // Select payment strategy
    const strategy = PaymentFactory.create(data.provider);

    // Initiate payment with provider
    const response = await strategy.initiatePayment(data.orderId);

    // Save transaction ID
    if (response.transactionId) {
      await this.paymentRepo.updateTransactionId(
        payment.id,
        response.transactionId
      );
    }

    return response;
  }

  /**
   * Verify a payment.
   */
  async verify(
    paymentId: string,
    transactionId: string,
    userId: string
  ) {
    const payment = await this.paymentRepo.findByIdWithOwner(paymentId);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.order.userId !== userId) {
      throw new Error("Unauthorized access.");
    }

    const strategy = PaymentFactory.create(payment.provider);

    const response = await strategy.verifyPayment(transactionId);

    await this.paymentRepo.markPaid(payment.id, transactionId);

    await this.orderService.completeOrder(payment.orderId);

    return response;
  }

  /**
   * Refund a payment.
   */
  async refund(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findByIdWithOwner(paymentId);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.order.userId !== userId) {
      throw new Error("Unauthorized access.");
    }

    if (!payment.transactionId) {
      throw new Error("Payment has no transaction ID.");
    }

    const strategy = PaymentFactory.create(payment.provider);

    const response = await strategy.refund(payment.transactionId);

    await this.paymentRepo.markRefunded(payment.id);

    return response;
  }

  /**
   * Get payment details.
   */
  async read(id: string, userId: string) {
    const payment = await this.paymentRepo.findByIdWithOwner(id);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    if (payment.order.userId !== userId) {
      throw new Error("Unauthorized access.");
    }

    return payment;
  }

  /**
   * Update payment status.
   */
  async updateStatus(id: string, status: PaymentStatus) {
    const payment = await this.paymentRepo.findById(id);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return this.paymentRepo.updateStatus(id, status);
  }

  /**
   * Handle Stripe webhook.
   */
  async handleStripeWebhook(req: Request) {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      throw new Error("Missing Stripe signature.");
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;

        if (!orderId) {
          throw new Error("Order ID missing from Stripe metadata.");
        }

        const payment = await this.paymentRepo.findByOrderId(orderId);

        if (!payment) {
          throw new Error("Payment not found.");
        }

        // Prevent duplicate webhook processing
        if (payment.status === PaymentStatus.PAID) {
          return true;
        }

        await this.paymentRepo.markPaid(
          payment.id,
          session.payment_intent as string
        );

        await this.orderService.completeOrder(payment.orderId);

        break;
      }

      default:
        break;
    }

    return true;
  }

  /**
   * Handle bKash callback.
   */
  async handleBKashCallback(req: Request) {
    const { paymentID, status } = req.body;

    if (!paymentID) {
      throw new Error("Missing payment ID.");
    }

    const payment = await this.paymentRepo.findByTransactionId(paymentID);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    // Prevent duplicate callbacks
    if (payment.status === PaymentStatus.PAID) {
      return true;
    }

    const strategy = PaymentFactory.create(payment.provider);

    const result = await strategy.verifyPayment(paymentID);

    if (status === "success") {
      await this.paymentRepo.markPaid(payment.id, paymentID);

      await this.orderService.completeOrder(payment.orderId);
    } else {
      await this.paymentRepo.markFailed(payment.id);
    }

    return result;
  }
}