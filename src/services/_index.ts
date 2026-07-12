// import repositories
import { categoryRepository, userRepository } from "../repositories/_index.js";
import { productRepository } from "../repositories/_index.js";

// import repositories
import { UserService } from "./user.service.js";
import { TokenService } from "./token.service.js";
import { AuthService } from "./auth.service.js";
import { PasswordService } from "./password.service.js";
import { ProductService } from "./product.service.js";
import { CategoryService } from "./category.service.js";

import RedisService from "./redis.service.js";

// redis
const redisService = new RedisService();

// Services
const userService = new UserService(userRepository);
const tokenService = new TokenService();
const passwordService = new PasswordService();
const authService = new AuthService(
  userRepository,
  passwordService,
  tokenService
);
const productService = new ProductService(productRepository, redisService);
const categoryService = new CategoryService(categoryRepository);

// Services collection
const services = {
  redisService,
  userService,
  tokenService,
  authService,
  passwordService,
  productService,
  categoryService
};

export default services;
