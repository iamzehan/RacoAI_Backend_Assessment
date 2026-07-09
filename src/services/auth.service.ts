import { User } from "../generated/prisma/client.js";
import { UserRepository } from "../repositories/user.repository.js";
import { PasswordService } from "./password.service.js";
import { TokenService } from "./token.service.js";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService
  ) {}

  //   REGISTER USER
  register = async (data: UserInput) => {
    // unpack credentials
    const { email, password } = data;
    // Check if email exists
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already exists");
    }
    // If user doesn't exist then create user

    // hash password
    const passwordHash = await this.passwordService.hashPassword(password);
    // create new user
    return this.userRepository.createUser({ email, password: passwordHash });
  };

  //   UPDATE USER DATA
  update = async (data: UserInput) => {
    // unpack credentials
    const { email, password } = data;
    // Check if email exists
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      // hash password
      const passwordHash = await this.passwordService.hashPassword(password);
      // create new user
      return this.userRepository.createUser({ email, password: passwordHash });
    } else {
      throw new Error("Email is not registered");
    }
  };

  //   LOGIN USER
  login = async (data: UserInput): Promise<TokenCredentials> => {
    // unpack credentials
    const { email, password } = data;
    // get registered user
    const user = await this.userRepository.findByEmail(email);

    // compare passwords
    if (
      !user ||
      !(await this.passwordService.comparePassword(password, user.password))
    ) {
      throw new Error("Invalid Credentials!");
    }
    // get JWT Tokens
    const accessToken = this.tokenService.signAccessToken(user.id);
    const refreshToken = this.tokenService.signRefreshToken(user.id);
    return {
      user: {
        userId: user.id,
        email
      },
      accessToken,
      refreshToken
    };
  };

  // refresh token service
  refresh = async (refreshToken: string): Promise<TokenCredentials> => {
    // verify refresh token
    const payload = this.tokenService.verifyJWT(refreshToken, "refresh");
    if (payload) {
      // find user
      const user = await this.userRepository.findById(payload.sub);
      // sign access & refresh token
      if (user) {
        const access = this.tokenService.signAccessToken(user.id);
        const refresh = this.tokenService.signRefreshToken(user.id);
        return {
          user: {
            userId: user.id,
            email: user.email
          },
          accessToken: access,
          refreshToken: refresh
        };
      } else {
        throw new Error("Refresh failed!");
      }
    } else {
      throw new Error("Token might be expired!");
    }
  };
}
