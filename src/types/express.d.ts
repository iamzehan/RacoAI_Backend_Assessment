import "express";
import { Role } from "../generated/prisma/enums.ts";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: Role
    }
  }
}