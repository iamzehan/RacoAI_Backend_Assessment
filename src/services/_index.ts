// import repositories
import * as repository from "../repositories/_index.js";


// import repositories
import { UserService } from "./user.service.js";
import { TokenService } from "./token.service.js";
import { AuthService } from "./auth.service.js";
import { PasswordService } from "./password.service.js";
import { ProductService } from "./product.service.js";
import { CategoryService } from "./category.service.js";
import { OrderService } from "./order.service.js";
import { PaymentService } from "./payment.service.js";
import RedisService from "./redis.service.js";

// redis
const redisService = new RedisService();

// Services
const userService = new UserService(repository.userRepository);
const tokenService = new TokenService();
const passwordService = new PasswordService();
const authService = new AuthService(
  repository.userRepository,
  passwordService,
  tokenService
);
const categoryService = new CategoryService(repository.categoryRepository);
const productService = new ProductService(
  repository.productRepository,
  categoryService,
  redisService
);

// orders
const orderService = new OrderService(repository.orderRepository, redisService);

// payment
const paymentService = new PaymentService(repository.paymentRepository);

// Services collection
const services = {
  redisService,
  userService,
  tokenService,
  authService,
  passwordService,
  productService,
  categoryService,
  orderService,
  paymentService
};

export default services;
