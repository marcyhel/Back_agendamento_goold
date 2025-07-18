import { Request, Response, NextFunction } from "express";
import {
  getPaginationParams,
  getFilterParams,
} from "../../utils/pagination";

import {
  getAllReservationsService,
  getFreeReservationByRoomIdandDateService,
  getReservationByRoomIdAndDateService,
  createReservationService,
  getReservationsByUserIdService,
  cancellationReservationService,
  confirmReservationService,
} from "../../services/reservation/reservation.service";

export const fetchAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);
    const data = await getAllReservationsService(pagination, filters);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const fetchAvailableSlotsByRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: roomId } = req.params;
    const { date } = req.body;
    const slots = await getFreeReservationByRoomIdandDateService(roomId, date);
    res.status(200).json(slots);
  } catch (err) {
    next(err);
  }
};

export const fetchReservationsByRoomAndDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.params;
    const { date } = req.body;
    const reservations = await getReservationByRoomIdAndDateService(roomId, date);
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

export const handleCreateReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const result = await createReservationService(payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const fetchUserReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);
    const result = await getReservationsByUserIdService(userId, pagination, filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;
    const userId = req.context?.userId;

    if (!userId) {
      res.status(400).json({ error: "Usuário não identificado." });
    }

    const result = await cancellationReservationService(reservationId, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const confirmReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;
    const confirmation = await confirmReservationService(reservationId);
    res.status(200).json(confirmation);
  } catch (err) {
    next(err);
  }
};
