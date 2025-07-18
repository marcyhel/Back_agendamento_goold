import { Router } from "express";
import {
  handleUserRegistration,
  handleUserLogin,
  handleAdminLogin,
  verifyEmailExists,
} from "../controllers/auth/auth.controller";

const authRoutes = Router();

authRoutes.post("/signup", handleUserRegistration);
authRoutes.post("/signin", handleUserLogin);
authRoutes.post("/admin", handleAdminLogin);
authRoutes.post("/verify_mail", verifyEmailExists);

authRoutes.post("/signout", (_, res) => {
  res.status(200).json({ message: "Sign-out successful" });
});

export default authRoutes;
