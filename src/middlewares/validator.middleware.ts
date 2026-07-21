import { NextFunction, Request, Response } from "express";
import validator from "validator";

export class ValidationMiddleware {
  /**
   * Validate user registration.
   */
  register(req: Request, res: Response, next: NextFunction) {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
    } = req.body;

    const errors: Record<string, string> = {};

    // Email
    if (!email || !validator.isEmail(email)) {
      errors.email = "A valid email address is required.";
    }

    // Username
    const usernameRegex =
      /^(?=.{3,30}$)(?!.*[._]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;

    if (!username) {
      errors.username = "Username is required.";
    } else if (!usernameRegex.test(username)) {
      errors.username =
        "Username must be 3–30 characters and may contain letters, numbers, '.' and '_'.";
    }

    // Password
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d).{12,128}$/;

    if (!password) {
      errors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be 12–128 characters and contain at least one letter and one number.";
    }

    // First Name
    if (!firstName || firstName.trim().length < 2) {
      errors.firstName =
        "First name must contain at least 2 characters.";
    }

    // Last Name
    if (!lastName || lastName.trim().length < 2) {
      errors.lastName =
        "Last name must contain at least 2 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    req.body.email = validator.normalizeEmail(email) ?? email;
    req.body.username = username.trim().toLowerCase();
    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();

    next();
  }

  /**
   * Validate user login.
   */
    login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const errors: Record<string, string> = {};

    if (!email || !validator.isEmail(email)) {
      errors.email = "A valid email address is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    req.body.email = validator.normalizeEmail(email) ?? email;

    next();
  }
}