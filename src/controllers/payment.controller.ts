import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Initiate a payment.
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new Error("Unauthorized!");
      }

      const payment = await this.paymentService.initiate({
        ...req.body,
        userId,
      });

      res
        .status(201)
        .json(ApiResponse.success("Payment initiated successfully.", payment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify a payment.
   */
  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new Error("Unauthorized!");
      }

      const { paymentId, transactionId } = req.body;

      const payment = await this.paymentService.verify(
        paymentId,
        transactionId,
        userId
      );

      res
        .status(200)
        .json(ApiResponse.success("Payment verified successfully.", payment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refund a payment.
   */
  refund = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.params;
      const userId = req.userId;

      if (!userId) {
        throw new Error("Unauthorized!");
      }

      const refund = await this.paymentService.refund(
        paymentId.toString(),
        userId
      );

      res
        .status(200)
        .json(ApiResponse.success("Payment refunded successfully.", refund));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get payment details.
   */
  readOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.params;
      const userId = req.userId;

      if (!userId) {
        throw new Error("Unauthorized!");
      }

      const payment = await this.paymentService.read(
        paymentId.toString(),
        userId
      );

      res
        .status(200)
        .json(ApiResponse.success("Payment retrieved successfully.", payment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update payment status.
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.params;
      const { status } = req.body;

      const payment = await this.paymentService.updateStatus(
        paymentId.toString(),
        status
      );

      res
        .status(200)
        .json(
          ApiResponse.success("Payment status updated successfully.", payment)
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Stripe Webhook
   */
  stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.paymentService.handleStripeWebhook(req);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * bKash Callback
   */
  bkashCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.paymentService.handleBKashCallback(req);

      res
        .status(200)
        .json(
          ApiResponse.success("bKash callback processed successfully.", result)
        );
    } catch (error) {
      next(error);
    }
  };
}