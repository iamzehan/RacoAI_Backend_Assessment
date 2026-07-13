import { Router } from "express";

import controller from "../../controllers/_index.js";
import { auth } from "../../middlewares/_index.js";

const router = Router();

/**
 * Create Order
 */
router.post("/", auth.requireAuth, controller.orderController.createOrder);

/**
 * Get Orders
 *
 * USER =====> own orders
 * ADMIN =====> all orders
 */
router.get(
  "/",
  auth.requireAuth,
  auth.ensureRole,
  controller.orderController.getOrders
);

/**
 * Get Order
 */
router.get(
  "/details",
  auth.requireAuth,
  auth.ensureRole,
  controller.orderController.getOrder
);

/**
 * Update Status
 */
router.patch(
  "/:id/status",
  auth.ensureAdmin,
  controller.orderController.updateStatus
);

/**
 * Cancel Order
 */
router.patch(
  "/:id/cancel",
  auth.requireAuth,
  controller.orderController.cancelOrder
);

/**
 * Delete Order
 */
router.delete("/:id", auth.ensureAdmin, controller.orderController.deleteOrder);

export default router;
