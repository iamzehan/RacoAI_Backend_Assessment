import { Router } from "express";
import { auth } from "../../middlewares/_index.js";
import controller from "../../controllers/_index.js";

const router = Router();

router.get("/profile/me", auth.requireAuth, controller.userController.getProfile);

// This route is for client to check username available ✅ or taken ❌
router.get("/check-usernames", auth.ensureGuest, controller.userController.getUsernames)
export default router;