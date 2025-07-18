import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/custom_error";
import { User } from "../database/models";

type Permission = "logs" | "scheduling";

export function requirePermission(permission: Permission) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.context?.userId;

    if (!userId) {
      return next(new CustomError("Invalid token", 401));
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      if (!user.hasPermission(permission)) {
        return next(new CustomError("Access denied: Insufficient permissions", 403));
      }

      req.user = user;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.context?.userId;

  if (!userId) {
    return next(new CustomError("Invalid token", 401));
  }

  try {
    const user = await User.findByPk(userId);

    if (!user || user.role !== "admin") {
      return next(new CustomError("Access denied: Administrators only", 403));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
