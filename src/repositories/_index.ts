import { ProductRepository } from "./product.repository.js";
import { UserRepository } from "./user.repository.js";

export const userRepository = new UserRepository();
export const productRepository = new ProductRepository();