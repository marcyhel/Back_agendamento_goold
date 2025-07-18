import { CustomError } from "../utils/custom_error";
import { verifyJWT } from "./jwt.service";
import config from "../config/config";
import { NextFunction, Request, Response } from "express";

async function extractToken(authHeader?: string) {
  if (!authHeader) {
    throw new CustomError("Authorization header is required", 401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  return verifyJWT(token, config.JWT_ACCESS_TOKEN_SECRET as string);
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, path } = req;

  if (method === "OPTIONS" || path === "/api/auth/signin") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const decodedPayload = await extractToken(authHeader as string);
    req.context = decodedPayload;
    next();
  } catch (err) {
    next(err);
  }
};
