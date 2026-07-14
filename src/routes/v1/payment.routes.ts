import { Router } from "express";
import controller from "../../controllers/_index.js";
import { auth } from "../../middlewares/_index.js";

const paymentRouter = Router();

/**
 * Initiate Payment
 */
paymentRouter.post(
  "/",
  auth.requireAuth,
  controller.paymentController.create
);

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
paymentRouter.post(
  "/verify",
  auth.requireAuth,
  controller.paymentController.verify
);

/**
 * Refund Payment
 */
paymentRouter.post(
  "/:paymentId/refund",
  auth.requireAuth,
  controller.paymentController.refund
);

/**
 * Get Payment
 */
paymentRouter.get(
  "/:paymentId",
  auth.requireAuth,
  controller.paymentController.readOne
);

/**
 * Update Payment Status
 */
paymentRouter.patch(
  "/:paymentId/status",
  auth.requireAuth,
  auth.ensureAdmin,
  controller.paymentController.updateStatus
);

export default paymentRouter;