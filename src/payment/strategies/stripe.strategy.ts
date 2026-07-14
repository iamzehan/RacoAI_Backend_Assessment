import Stripe from "stripe";
import { env } from "../../config/env.js";
import { stripe } from "../clients/stripe.client.js";
import { PaymentStrategy } from "./payment.strategy.js";

export class StripeStrategy implements PaymentStrategy {
  async initiatePayment(orderId: string): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // TODO: Replace with actual order items from your database.
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${orderId}`
            },
            unit_amount: 1000 // $10.00
          },
          quantity: 1
        }
      ],

      metadata: {
        orderId
      },

      success_url: `${env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/payment/cancel`
    });

    return session;
  }

  async verifyPayment(
    transactionId: string
  ): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.retrieve(transactionId);

    return session;
  }

  async refund(transactionId: string): Promise<Stripe.Refund> {
    const refund = await stripe.refunds.create({
      payment_intent: transactionId
    });

    return refund;
  }
}