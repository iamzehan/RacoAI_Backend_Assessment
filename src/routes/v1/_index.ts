import { Router } from "express";
import userRoutes from "./user.routes.js";
import productRoutes from "./products.routes.js";
import categoryRoutes from "./categories.routes.js";
import orderRoutes from "./orders.routes.js";
import paymentRouter from "./payment.routes.js";
const router = Router();

router.use("/user", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRouter);

export default router;
