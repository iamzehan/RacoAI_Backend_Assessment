import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class RefreshController {
  constructor(private authService: AuthService) {}

  refresh = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    try {
      const credentials = await this.authService.refresh(token);
      // http cookie response with credentials
      res
        .cookie("accessToken", credentials.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", credentials.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000
        })
        .json(credentials.user);
    } catch (err) {
      res.status(401).json({ message: err });
    }
  };
}
