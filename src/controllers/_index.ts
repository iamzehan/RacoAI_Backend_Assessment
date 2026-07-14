
// import services
import services from "../services/_index.js";

// import controllers
import { AuthController } from "./auth.controller.js";
import { UserController } from "./user.controller.js";
import { RefreshController } from "./refresh.controller.js";
import { ProductController } from "./product.controller.js";
import { CategoryController } from "./category.controller.js";
import { OrderController } from "./order.controller.js";
import { PaymentController } from "./payment.controller.js";
import { HealthController } from "./health.controller.js";

// Controllers
const authController = new AuthController(services.authService);
const refreshController = new RefreshController(services.authService);
const userController = new UserController(services.userService);
const productController = new ProductController(services.productService);
const categoryController = new CategoryController(services.categoryService);
const orderController = new OrderController(services.orderService);
const paymentController = new PaymentController(services.paymentService);
const healthController = new HealthController();
// Add to controller collection
const controller = {
  authController,
  refreshController,
  userController,
  productController,
  categoryController,
  orderController,
  paymentController,

  // health
  healthController
};


export default controller;