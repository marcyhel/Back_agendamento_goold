import { Request, Response, NextFunction } from "express";
import {
  retrieveAllRooms,
  retrieveRoomById,
  registerNewRoom,
  modifyRoom,
} from "../../services/room/room.service";

export const fetchRoomsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await retrieveAllRooms();
    res.status(200).json({ rooms: result });
  } catch (err) {
    next(err);
  }
};

export const fetchRoomByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roomId } = req.params;
    const room = await retrieveRoomById(roomId);
    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

export const createNewRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;

    const created = await registerNewRoom(data);
    res.status(201).json({ newRoom: created });
  } catch (err) {
    next(err);
  }
};

export const editRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roomId } = req.params;
    const data = req.body;
    const updated = await modifyRoom(roomId, data);
    res.status(200).json({ updatedRoom: updated });
  } catch (err) {
    next(err);
  }
};
