import { Router } from "express";
import { UserService } from "../../services/user.service.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { UserController } from "../../controllers/user.controller.js";
import { AuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { TokenService } from "../../services/token.service.js";

const router = Router();

// Repository
const userRepository = new UserRepository();
// Service
const userService = new UserService(userRepository);
// Controller
const userController = new UserController(userService);

// middlewares
const tokenService = new TokenService(); // dependency
const authMiddleware = new AuthenticationMiddleware(tokenService);

router.post("/profile/me", authMiddleware.requireAuth, userController.getProfile);

export default router;