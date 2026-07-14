import { Router } from "express";
import controller from "../../controllers/_index.js";

const paymentRouter = Router();

/**
 * Initiate Payment
 */
paymentRouter.post("/", controller.paymentController.create);

/**
 * Stripe Webhook
 */
paymentRouter.post(
  "/webhook/stripe",
  controller.paymentController.stripeWebhook
);

/**
 * bKash Callback
 */
paymentRouter.post(
  "/callback/bkash",
  controller.paymentController.bkashCallback
);

/**
 * Verify Payment
 */
paymentRouter.post("/verify", controller.paymentController.verify);

/**
 * Refund Payment
 */
paymentRouter.post(
  "/:paymentId/refund",
  controller.paymentController.refund
);

/**
 * Get Payment
 */
paymentRouter.get(
  "/:paymentId",
  controller.paymentController.readOne
);

/**
 * Update Payment Status
 */
paymentRouter.patch(
  "/:paymentId/status",
  controller.paymentController.updateStatus
);

export default paymentRouter;