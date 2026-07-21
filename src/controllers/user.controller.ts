import { UserService } from "../services/user.service.js";
import { Request, Response } from "express";
import { HttpStatus } from "../utils/constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// User Controller
export class UserController {
  constructor(private userService: UserService) {}
  // GET USER PROFILE
  getProfile = async (req: Request, res: Response) => {
    // User Id comes from Auth middleware
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const profile = await this.userService.profile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  };

  // CHECK FOR AVAILABLE USERNAMES
  getUsernames = async (req: Request, res: Response) => {
    const {username} = req.query;
    if(!username) return res.status(HttpStatus.NOT_FOUND).json(ApiResponse.error("Page not found"));
    const user = this.userService.findByUserName(username.toString());
    if(!user) {
      return res.status(HttpStatus.OK).json(
        ApiResponse.success("Username is Available")
      )
    }
    else {
      return res.status(HttpStatus.OK).json(
        ApiResponse.success("Username is Taken")
      )
    }
  }
}
