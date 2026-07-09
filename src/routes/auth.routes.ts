import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { PasswordService } from "../services/password.service.js";
import { TokenService } from "../services/token.service.js";
import { UserService } from "../services/user.service.js";
import { RefreshController } from "../controllers/refresh.controller.js";
import { AuthenticationMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const tokenService = new TokenService();

// Authentication Service
const authService = new AuthService(
  userRepository,
  passwordService,
  tokenService
);

// Controllers
const authController = new AuthController(authService);
const refreshController = new RefreshController(authService);

// routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", refreshController.refresh);

export default router;
