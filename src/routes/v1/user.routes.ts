import { Router } from "express";
import { auth } from "../../middlewares/_index.js";
import controller from "../../controllers/_index.js";
import { validation } from "../../middlewares/_index.js";

const router = Router();

router.get("/admins", auth.ensureSuperAdmin, controller.userController.getAdmins);
router.patch("/admins/:id", auth.ensureSuperAdmin, controller.userController.updateAdminProfile);

router.get(
  "/profile/me",
  auth.requireAuth,
  controller.userController.getProfile
);

router.patch(
  "/profile/me",
  auth.requireAuth,
  controller.userController.updateProfile
);

// This route is for client to check username available ✅ or taken ❌
router.get(
  "/check-usernames",
  auth.ensureGuest,     // ensures that the user is a guest
  validation.username, // Validates username first before making a database query
  controller.userController.getUsernames // finally lets the username through
);
export default router;
