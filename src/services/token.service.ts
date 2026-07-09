import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export class TokenService {
  constructor() {}
  signAccessToken = (userId: string) =>
    jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });

  signRefreshToken = (userId: string) =>
    jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}
