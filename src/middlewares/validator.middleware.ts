import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { USERNAME_REGEX, PASSWORD_REGEX } from "../utils/constants.js";
export class ValidationMiddleware {
  private readonly usernameRegex = USERNAME_REGEX;

  private readonly passwordRegex = PASSWORD_REGEX;

  private validationFailed(
    res: Response,
    errors: Record<string, string>
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  private validateEmail(
    email: string | undefined,
    errors: Record<string, string>
  ) {
    if (!email || !validator.isEmail(email)) {
      errors.email = "A valid email address is required.";
      return;
    }

    return validator.normalizeEmail(email) ?? email;
  }

  private validateUsername(
    username: string | undefined,
    errors: Record<string, string>
  ) {
    if (!username) {
      errors.username = "Username is required.";
      return;
    }

    if (!this.usernameRegex.test(username)) {
      errors.username =
        "Username must be 3–30 characters and may contain letters, numbers, '.' and '_'.";
      return;
    }

    return username.trim().toLowerCase();
  }

  private validatePassword(
    password: string | undefined,
    errors: Record<string, string>
  ) {
    if (!password) {
      errors.password = "Password is required.";
      return;
    }

    if (!this.passwordRegex.test(password)) {
      errors.password =
        "Password must be 12–128 characters and contain at least one letter and one number.";
    }
  }

  private validateName(
    value: string | undefined,
    field: "firstName" | "lastName",
    errors: Record<string, string>
  ) {
    if (!value || value.trim().length < 2) {
      errors[field] = `${field === "firstName" ? "First" : "Last"} name must contain at least 2 characters.`;
      return;
    }

    return value.trim();
  }

  register(req: Request, res: Response, next: NextFunction) {
    const { email, username, password, firstName, lastName } = req.body;

    const errors: Record<string, string> = {};

    const normalizedEmail = this.validateEmail(email, errors);
    const normalizedUsername = this.validateUsername(username, errors);
    this.validatePassword(password, errors);
    const normalizedFirstName = this.validateName(
      firstName,
      "firstName",
      errors
    );
    const normalizedLastName = this.validateName(
      lastName,
      "lastName",
      errors
    );

    if (Object.keys(errors).length) {
      return this.validationFailed(res, errors);
    }

    req.body.email = normalizedEmail;
    req.body.username = normalizedUsername;
    req.body.firstName = normalizedFirstName;
    req.body.lastName = normalizedLastName;

    next();
  }

  login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const errors: Record<string, string> = {};

    const normalizedEmail = this.validateEmail(email, errors);

    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length) {
      return this.validationFailed(res, errors);
    }

    req.body.email = normalizedEmail;

    next();
  }


  username(req: Request, res: Response, next: NextFunction) {
    const username = req.params.username as string;

    const errors: Record<string, string> = {};

    const normalizedUsername = this.validateUsername(username, errors);

    if (Object.keys(errors).length) {
      return this.validationFailed(res, errors);
    }

    req.query.username = normalizedUsername!;

    next();
  }
}