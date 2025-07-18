import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import profileRoutes from "./profile.routes";
import roomRoutes from "./room.routes";
import logRoutes from "./log.routes";
import reservationRoutes from "./reservation.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/room", roomRoutes);
router.use("/reservation", reservationRoutes);
router.use("/log", logRoutes);

export default router;
