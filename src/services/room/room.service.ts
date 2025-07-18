import roomRepo from "../../wrappers/room/room.repo";
import reservationRepo from "../../wrappers/reservation/reservation.repo";
import { RoomInterface } from "../../interfaces/room.interface";
import LogService from "../log/log.service";
import {
  createRoomValidator,
  updateRoomValidator,
} from "../../wrappers/room/room.validator";
import { CustomError } from "../../utils/custom_error";

export const retrieveAllRooms = async () => {
  try {
    console.log('aaaa')
    return await roomRepo.getAllRooms();
  } catch {
    throw new CustomError("Failed to fetch rooms", 500);
  }
};

export const retrieveRoomById = async (id: string) => {
  try {
    if (!id) throw new CustomError("Room ID is required", 400);

    const found = await roomRepo.findRoomById(id);
    if (!found) throw new CustomError("Room not found", 404);

    return found;
  } catch {
    throw new CustomError("Failed to fetch room", 500);
  }
};

export const registerNewRoom = async (payload: RoomInterface) => {
  try {
    console.log(payload)
    const { error } = createRoomValidator(payload);
    console.log(error)
    if (error) throw new CustomError(error.message, 400);

    return await roomRepo.createRoom(payload);
  } catch {
    throw new CustomError("Failed to create room", 500);
  }
};

export const modifyRoom = async (roomId: string, updates: any) => {
  try {
    if (!roomId) throw new CustomError("Room ID is required", 400);

    const { error } = updateRoomValidator(updates);
    if (error) throw new CustomError(error.message, 400);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservationsToCancel = [
      ...(await reservationRepo.findReservationsByRoomIdAndStatus(roomId, ["pending"])),
      ...(await reservationRepo.findReservationsByRoomIdStatusAndDate(roomId, ["confirmed"], today)),
    ];

    if (reservationsToCancel.length > 0) {
      const reservationIds = reservationsToCancel.map(r => r.id);
      await reservationRepo.cancelMultipleReservations(reservationIds);

      reservationsToCancel.forEach(res => {
        LogService.registerActivity(
          res.userId,
          "reservation",
          "Cancelamento automático por alteração de sala",
          `Reserva cancelada automaticamente devido à alteração da sala ${roomId}`
        );
      });
    }

    const updated = await roomRepo.updateRoom(roomId, updates);
    if (!updated) throw new CustomError("Room not found or failed to update", 404);

    LogService.registerActivity(
      "system",
      "reservation",
      "Alteração de sala",
      `Sala ${roomId} modificada. ${reservationsToCancel.length} reservas foram canceladas automaticamente`
    );

    return updated;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to update room", 500);
  }
};
