import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service.js";
import { UserService } from "../services/user.service.js";
import { HttpStatus } from "../utils/constants.js";
import { Role } from "../generated/prisma/enums.js";
export class AuthenticationMiddleware {
  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  private getToken(req: Request): string | null {
    const bearer = req.headers.authorization?.split(" ")[1];

    if (bearer) return bearer;

    return req.cookies?.accessToken ?? null;
  }

  private verifyToken(req: Request) {
    const token = this.getToken(req);
    if (!token) return null;

    try {
      return this.tokenService.verifyJWT(token, "access");
    } catch {
      return null;
    }
  }

  private async attachUser(req: Request) {
    const payload = this.verifyToken(req);
    if (!payload) return null;

    req.userId = payload.sub;

    const user = await this.userService.profile(payload.sub);
    if (!user) return null;

    req.userRole = user.role;

    return user;
  }

  /**
   * Authentication Required
   */
  requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const payload = this.verifyToken(req);

    if (!payload) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    req.userId = payload.sub;

    next();
  };

  /**
   * Only Guests
   */
  ensureGuest = (req: Request, res: Response, next: NextFunction) => {
    const payload = this.verifyToken(req);

    if (payload) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Already authenticated" });
    }

    next();
  };

  /**
   * Attach user information if authenticated.
   * Never blocks the request.
   */
  ensureRole = async (req: Request, res: Response, next: NextFunction) => {
    await this.attachUser(req);
    next();
  };

  /**
   * Admin Only
   */
  ensureAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.attachUser(req);

    if (!user) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }

    next();
  };
}
