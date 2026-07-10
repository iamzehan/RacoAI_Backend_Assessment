import { Router } from "express";
import controller from "../controllers/_index.js";
const router = Router();

// routes
router.post("/register", controller.authController.register);
router.post("/login", controller.authController.login);
router.post("/logout", controller.authController.logout);
router.post("/refresh", controller.refreshController.refresh);

export default router;
