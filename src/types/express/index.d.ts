import { JwtPayload } from "jsonwebtoken";
import { User } from "../../database/models/User";

declare global {
  namespace Express {
    interface Request {
      context?: JwtPayload;
      user?: User;
    }
  }
}

export {};
