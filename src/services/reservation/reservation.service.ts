import { CustomError } from "../../utils/custom_error";
import reservationRepo from "../../wrappers/reservation/reservation.repo";
import { ReservationInterface } from "../../interfaces/Reservation.interface";
import { RoomInterface } from "../../interfaces/room.interface";
import roomRepo from "../../wrappers/room/room.repo";
import { createReservationValidator } from "../../wrappers/reservation/reservation.validator";
import userRepo from "../../wrappers/user/user.repo";
import LogService from "../log/log.service";
import { PaginationParams, FilterParams } from "../../utils/pagination";

const getAvailableSlots = (
  room: RoomInterface,
  reservations: ReservationInterface[]
): string[] => {
  const { startTime, endTime, time_block } = room;

  const [h0, m0] = startTime.split(":").map(Number);
  const [h1, m1] = endTime.split(":").map(Number);
  const start = h0 * 60 + m0;
  const end = h1 * 60 + m1;

  const totalBlocks = Math.floor((end - start) / time_block);
  const occupied = Array(totalBlocks).fill(false);

  const confirmed = reservations.filter((b) => b.status === "confirmed");

  confirmed.forEach((b) => {
    const [bh, bm] = b.time.split(":").map(Number);
    const bStart = bh * 60 + bm;
    const blockIndex = Math.floor((bStart - start) / time_block);
    if (blockIndex >= 0 && blockIndex < totalBlocks) {
      occupied[blockIndex] = true;
    }
  });

  const available: string[] = [];
  for (let i = 0; i < totalBlocks; i++) {
    if (!occupied[i]) {
      const t = start + i * time_block;
      const hh = String(Math.floor(t / 60)).padStart(2, "0");
      const mm = String(t % 60).padStart(2, "0");
      available.push(`${hh}:${mm}`);
    }
  }

  return available;
};

const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const isSlotAvailable = (
  room: RoomInterface,
  reservations: ReservationInterface[],
  desiredTime: string
): boolean => {
  if (!isValidTimeFormat(desiredTime)) {
    return false;
  }

  const { startTime, endTime, time_block } = room;

  const [h0, m0] = startTime.split(":").map(Number);
  const [h1, m1] = endTime.split(":").map(Number);
  const startMinutes = h0 * 60 + m0;
  const endMinutes = h1 * 60 + m1;

  const [dh, dm] = desiredTime.split(":").map(Number);
  const desiredStart = dh * 60 + dm;
  const desiredEnd = desiredStart + time_block;

  if (desiredStart < startMinutes || desiredEnd > endMinutes) {
    return false;
  }

  const blockIndex = Math.floor((desiredStart - startMinutes) / time_block);
  const expectedSlotStart = startMinutes + blockIndex * time_block;

  if (desiredStart !== expectedSlotStart) {
    return false;
  }

  const confirmed = reservations.filter((b) => b.status === "confirmed");

  const hasOverlap = confirmed.some((b) => {
    const [bh, bm] = b.time.split(":").map(Number);
    const bStart = bh * 60 + bm;
    const bEnd = bStart + time_block;
    return desiredStart < bEnd && bStart < desiredEnd;
  });

  return !hasOverlap;
};

export const getAllReservationsService = async (
  paginationParams: PaginationParams,
  filterParams: FilterParams
) => {
  try {
    const reservations = await reservationRepo.getAllReservationsWithPagination(
      paginationParams,
      filterParams
    );
    return reservations;
  } catch (error) {
    throw new CustomError("Failed to retrieve reservations", 500);
  }
};

export const getFreeReservationByRoomIdandDateService = async (
  id: string,
  date: string
) => {
  try {
    if (!id) {
      throw new CustomError("Reservation ID is required", 400);
    }

    const room = await roomRepo.findRoomById(id);
    if (!room) {
      throw new CustomError("Room not found", 404);
    }

    const reservations = await reservationRepo.findReservationsByRoomIdAndDate(id, date);
    const availableSlots = getAvailableSlots(room, reservations);
    return { availableSlots };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to retrieve reservation by ID", 500);
  }
};

export const getReservationByRoomIdAndDateService = async (
  roomId: string,
  date: string
) => {
  try {
    if (!roomId || !date) {
      throw new CustomError("Room ID and date are required", 400);
    }
    const reservations = await reservationRepo.findReservationsByRoomIdAndDate(
      roomId,
      date
    );
    return reservations;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      "Failed to retrieve reservations by room ID and date",
      500
    );
  }
};

export const getReservationsByUserIdService = async (
  userId: string,
  paginationParams: PaginationParams,
  filterParams: FilterParams
) => {
  try {
    const reservations = await reservationRepo.getReservationsByUserIdWithPagination(
      userId,
      paginationParams,
      filterParams
    );
    return reservations;
  } catch (error) {
    throw new CustomError("Failed to retrieve user reservations", 500);
  }
};

export const createReservationService = async (
  reservationData: ReservationInterface
): Promise<ReservationInterface> => {
  try {
    const { error } = createReservationValidator(reservationData);
    if (error) {
      throw new CustomError(error.message, 400);
    }

    if (!isValidTimeFormat(reservationData.time)) {
      throw new CustomError("Invalid time format. Use HH:MM format", 400);
    }

    const room = await roomRepo.findRoomById(reservationData.roomId);
    if (!room) {
      throw new CustomError("Room not found", 404);
    }

    const user = await userRepo.findUserById(reservationData.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const date = reservationData.date;
    const roomId = reservationData.roomId;
    const reservations = await reservationRepo.findReservationsByRoomIdAndDate(
      roomId,
      date
    );
    if (!isSlotAvailable(room, reservations, reservationData.time)) {
      throw new CustomError(
        "Requested time slot is not available or invalid",
        409
      );
    }
    reservationData.status = "pending";
    const newReservation = await reservationRepo.createReservation(reservationData);
    LogService.registerActivity(
      user.id,
      "reservation",
      "Criação de agendamento",
      `Reservation created for room ${room.name} on ${date} at ${reservationData.time}`,
      undefined
    );
    return newReservation;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to create reservation", 500);
  }
};

export const cancellationReservationService = async (
  reservationId: string,
  userId: string
): Promise<{ status: string }> => {
  try {
    if (!reservationId) {
      throw new CustomError("Reservation ID is required", 400);
    }

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const reservation = await reservationRepo.findReservationById(reservationId);
    if (!reservation) {
      throw new CustomError("Reservation not found", 404);
    }
    if (user.role === "user" && reservation.userId !== userId) {
      throw new CustomError(
        "You do not have permission to cancel this reservation",
        403
      );
    }
    if (reservation.status === "cancelled") {
      throw new CustomError("Reservation is already cancelled", 400);
    }
    reservation.status = "cancelled";
    await reservationRepo.updateReservationStatus(reservationId, "cancelled");
    LogService.registerActivity(
      reservation.userId,
      "reservation",
      "Cancelamento de agendamento",
      `Reservation with ID ${reservationId} has been canceled`,
      undefined
    );
    return { status: "cancelled" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to cancel reservation", 500);
  }
};

export const confirmReservationService = async (
  reservationId: string
): Promise<{ status: string }> => {
  try {
    if (!reservationId) {
      throw new CustomError("Reservation ID is required", 400);
    }

    const reservation = await reservationRepo.findReservationById(reservationId);
    if (!reservation) {
      throw new CustomError("Reservation not found", 404);
    }
    if (reservation.status !== "pending") {
      throw new CustomError("Reservation is not in pending status", 400);
    }

    const conflictingReservations = await reservationRepo.findConflictingReservations(
      reservation.roomId,
      reservation.date,
      reservation.time,
      reservationId
    );

    if (conflictingReservations.length > 0) {
      const conflictingReservationIds = conflictingReservations.map((b) => b.id);
      await reservationRepo.cancelMultipleReservations(conflictingReservationIds);

      conflictingReservations.forEach((conflictReservation) => {
        LogService.registerActivity(
          conflictReservation.userId,
          "reservation",
          "Cancelamento automático por conflito",
          `Reservation cancelado automaticamente devido à aprovação de outro reservation para o mesmo horário`,
          undefined
        );
      });
    }

    reservation.status = "confirmed";
    await reservationRepo.updateReservationStatus(reservationId, "confirmed");

    LogService.registerActivity(
      reservation.userId,
      "reservation",
      "Confirmação de agendamento",
      `Reservation with ID ${reservationId} has been confirmed. ${conflictingReservations.length} conflicting reservations were cancelled`,
      undefined
    );

    return { status: "confirmed" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to confirm reservation", 500);
  }
};
