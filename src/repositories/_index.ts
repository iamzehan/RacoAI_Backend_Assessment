import { ProductRepository } from "./product.repository.js";
import { UserRepository } from "./user.repository.js";
import { CategoryRepository } from "./category.repository.js";
import {OrderRepository} from "./order.repository.js";

export const userRepository = new UserRepository();
export const productRepository = new ProductRepository();
export const categoryRepository = new CategoryRepository();
export const orderRepository = new OrderRepository();