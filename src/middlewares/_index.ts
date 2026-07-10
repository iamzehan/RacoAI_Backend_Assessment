import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";
import { TokenService } from "../services/token.service.js";
import { AuthenticationMiddleware } from "./auth.middleware.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const tokenService = new TokenService();

export const auth = new AuthenticationMiddleware(
  tokenService,
  userService
);