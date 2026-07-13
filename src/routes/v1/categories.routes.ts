import { Router } from "express";
import controller from "../../controllers/_index.js";
import { auth } from "../../middlewares/_index.js";

const router = Router();

// public
router.get("/", controller.categoryController.getCategories);
router.get("/tree", controller.categoryController.getTree);
router.get("/:id", controller.categoryController.getCategory);

// Admin
router.post(
  "/",
  auth.requireAuth,
  auth.ensureAdmin,
  controller.categoryController.createCategory
);
router.patch(
  "/:id",
  auth.requireAuth,
  auth.ensureAdmin,
  controller.categoryController.updateCategory
);

router.delete(
  "/:id",
  auth.requireAuth,
  auth.ensureAdmin,
  controller.categoryController.deleteCategory
);

export default router;
