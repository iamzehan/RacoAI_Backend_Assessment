// import repositories
import { userRepository } from "../repositories/_index.js";
import { productRepository } from "../repositories/_index.js";

// import services
import { UserService } from "../services/user.service.js";
import { TokenService } from "../services/token.service.js";
import { PasswordService } from "../services/password.service.js";
import { AuthService } from "../services/auth.service.js";

// import controllers
import { AuthController } from "./auth.controller.js";
import { UserController } from "./user.controller.js";
import { RefreshController } from "./refresh.controller.js";
import { ProductController } from "./product.controller.js";
import { ProductService } from "../services/product.service.js";

// Dependencies
const userService = new UserService(userRepository);
const tokenService = new TokenService();
const passwordService = new PasswordService();
const authService = new AuthService(
  userRepository,
  passwordService,
  tokenService
);
const productService = new ProductService(productRepository);

// Controllers
const authController = new AuthController(authService);
const refreshController = new RefreshController(authService);
const userController = new UserController(userService);
const productController = new ProductController(productService);

// Add to controller collection
const controller = {
  authController,
  refreshController,
  userController,
  productController
};


export default controller;