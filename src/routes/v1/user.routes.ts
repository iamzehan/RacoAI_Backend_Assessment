import { Router } from "express";
import { auth } from "../../middlewares/_index.js";
import controller from "../../controllers/_index.js";

const router = Router();

router.get("/profile/me", auth.requireAuth, controller.userController.getProfile);

export default router;