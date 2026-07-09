import { UserService } from "../services/user.service.js";
import { Request, Response } from "express";

// User Controller
export class UserController {
  constructor(private userService: UserService) {}
  // GET USER PROFILE
  getProfile = async (req: Request, res: Response) => {
    // User Id comes from Auth middleware
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const profile = this.userService.profile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  };
}
