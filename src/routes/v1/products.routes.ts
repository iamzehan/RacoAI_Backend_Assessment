import { Router } from "express";
import { auth } from "../../middlewares/_index.js";
import controller from "../../controllers/_index.js";

// initialize router
const router = Router();

// generate SKU
router.get("/sku", auth.ensureAdmin, controller.productController.getSKU);

// create
router.post("/", auth.ensureAdmin, controller.productController.createProducts);
// read
router.get("/", auth.ensureRole, controller.productController.getProducts);
// update
router.patch("/", auth.ensureAdmin, controller.productController.updateProduct);
// delete
router.delete(
  "/:id",
  auth.ensureAdmin,
  controller.productController.deleteProduct
);
router.delete(
  "/",
  auth.ensureAdmin,
  controller.productController.deleteProducts
);

export default router;
