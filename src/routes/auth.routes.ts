import { Router } from "express";
import controller from "../controllers/_index.js";
import { validation } from "../middlewares/_index.js";

const router = Router();

// routes
router.post("/register", validation.register, controller.authController.register);
router.post("/login", validation.login, controller.authController.login);
router.post("/logout", controller.authController.logout);
router.post("/refresh", controller.refreshController.refresh);

export default router;
