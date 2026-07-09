import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpStatus } from "../utils/constants.js";
// Authentication Controller
export class AuthController {
  constructor(private userService: AuthService) {}

  // Register credentials
  register = async (req: Request, res: Response) => {
    const data: UserInfo = req.body;
    // try creating credentials
    try {
      const credentials = await this.userService.register(data);
      res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("User creation was successful"));
    } catch {
      res
        .status(HttpStatus.CONFLICT)
        .json(ApiResponse.error("User with this email already exists."));
    }
  };

  // Login credentials
  login = async (req: Request, res: Response) => {
    // form data / request body
    const data = req.body;

    // user login
    const credentials = await this.userService.login(data);

    // http cookie response with credentials
    res
      .status(HttpStatus.OK)
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
  };

  // Logout and clear cookie
  logout = (req: Request, res: Response) => {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .sendStatus(HttpStatus.NO_CONTENT);
  };
}
