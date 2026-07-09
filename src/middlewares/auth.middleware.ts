import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { TokenService } from "../services/token.service.js";

export class AuthenticationMiddleware {
  constructor(private tokenService: TokenService) {}

  // Route Requires authentication
  requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
      const payload = this.tokenService.verifyJWT(token, "access");
      req.userId = payload.sub;
      next();
    } catch {
      res.sendStatus(401);
    }
  };
  // Ensure user is a guest
  ensureGuest = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(); // No token → guest allowed

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    try {
      const payload = this.tokenService.verifyJWT(token, "access");
      if (payload.sub) {
        return res.status(403).json({ message: "Already authenticated" });
      }
      next();
    } catch {
      next(); // Invalid token → treat as guest
    }
  };
}
