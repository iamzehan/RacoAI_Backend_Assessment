import { Router } from "express";
import userRoutes from "./user.routes.js";
import productRoutes from "./products.routes.js";
const router = Router();

router.use("/user", userRoutes);
router.use("/products", productRoutes);

export default router;