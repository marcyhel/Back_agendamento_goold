import { Request, Response, NextFunction } from "express";
import {
  registerUserService,
  authenticateUserService,
  emailExistsCheckService,
  authenticateAdminService,
} from "../../services/auth/auth.service";

export const handleUserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const { accessToken } = await registerUserService(payload);

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken } = await authenticateUserService(credentials);

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const handleAdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };

    const { accessToken } = await authenticateAdminService(credentials);

    res.status(200).json({
      message: "Admin login successful",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const emailToCheck = req.body.email;
    const result = await emailExistsCheckService(emailToCheck);

    res.status(200).json({
      message: "Email Validado",
      exists: result.exists,
    });
  } catch (err) {
    next(err);
  }
};
