import { Request, Response } from "express";
import { UserService } from "../services/auth.service.js";

class RefreshController {
  constructor(private userService: UserService) {}

  refresh = async (req: Request, res: Response) => {
    const token = req.session.refreshToken;
    if (!token) return res.sendStatus(401);
    try {
      const credentials = await this.userService.refresh(token);
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
