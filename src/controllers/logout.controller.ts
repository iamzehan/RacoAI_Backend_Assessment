import { Request, Response } from "express";
import { HttpStatus } from "../utils/constants.js";

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.sendStatus(HttpStatus.NO_CONTENT);
  });
};