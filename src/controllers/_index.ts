
// import services
import services from "../services/_index.js";

// import controllers
import { AuthController } from "./auth.controller.js";
import { UserController } from "./user.controller.js";
import { RefreshController } from "./refresh.controller.js";
import { ProductController } from "./product.controller.js";


// Controllers
const authController = new AuthController(services.authService);
const refreshController = new RefreshController(services.authService);
const userController = new UserController(services.userService);
const productController = new ProductController(services.productService);

// Add to controller collection
const controller = {
  authController,
  refreshController,
  userController,
  productController
};


export default controller;