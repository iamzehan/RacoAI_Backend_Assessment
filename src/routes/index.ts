import { Router } from "express";

// auth routes
import authRoutes from "./auth.routes.js";

// version 1 api routes
import v1 from "./v1/_index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/v1", v1)

export default router;