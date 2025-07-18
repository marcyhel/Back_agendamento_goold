import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";
import { cancelReservation, confirmReservation, fetchAllReservations, fetchAvailableSlotsByRoom, fetchReservationsByRoomAndDate, fetchUserReservations, handleCreateReservation } from "../controllers/reservation/reservation.controller";

const router = express.Router();

router.use(authMiddleware);

// Admin - ver todas as reservas
router.get("/", requireAdmin, fetchAllReservations);

// Usuário comum - reservas por agendamento
router.post("/free/:id", requirePermission("scheduling"), fetchAvailableSlotsByRoom);
router.get("/date/:roomId", requirePermission("scheduling"), fetchReservationsByRoomAndDate);
router.post("/", requirePermission("scheduling"), handleCreateReservation);
router.get("/user/:userId", requirePermission("scheduling"), fetchUserReservations);
router.post("/cancel/:reservationId", requirePermission("scheduling"), cancelReservation);

// Admin - confirmar reserva
router.post("/confirm/:reservationId", requireAdmin, confirmReservation);

export default router;
