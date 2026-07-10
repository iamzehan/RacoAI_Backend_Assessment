// import repositories
import { userRepository } from "../repositories/_index.js";
import { productRepository } from "../repositories/_index.js";

// import repositories
import { UserService } from "./user.service.js";
import { TokenService } from "./token.service.js";
import { AuthService } from "./auth.service.js";
import { PasswordService } from "./password.service.js";
import { ProductService } from "./product.service.js";

// Services 
const userService = new UserService(userRepository);
const tokenService = new TokenService();
const passwordService = new PasswordService();
const authService = new AuthService(
  userRepository,
  passwordService,
  tokenService
);
const productService = new ProductService(productRepository);

// Services collection
const services = {
    userService,
    tokenService,
    authService,
    passwordService,
    productService
}

export default services;