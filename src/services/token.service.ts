import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type Token = "access" | "refresh";
export class TokenService {
  constructor() {}
  // sign access token
  signAccessToken = (userId: string) =>
    jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });

  // Sign refresh token
  signRefreshToken = (userId: string) =>
    jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  // verify token
  verifyJWT = (token: string, category: Token) => {
    const secret =
      category === "refresh" ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
    try {
      const payload = jwt.verify(token, secret) as {
        sub: string;
      };
      return payload;
    } catch {
      return false;
    }
  };
}
