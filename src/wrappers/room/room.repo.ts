import { Room } from "../../database/models";
import { Transaction } from "sequelize";
import { RoomInterface } from "../../interfaces/room.interface";

const roomRepo = {
  getAllRooms: async (): Promise<Room[]> => {
    return await Room.findAll();
  },

  findRoomById: async (id: string): Promise<Room | null> => {
    return await Room.findByPk(id);
  },

  createRoom: async (
    roomData: RoomInterface,
    transaction?: Transaction
  ): Promise<Room> => {
    return await Room.create(roomData, { transaction });
  },

  updateRoom: async (
    id: string,
    roomData: Partial<RoomInterface>,
    transaction?: Transaction
  ): Promise<Room | null> => {
    const room = await Room.findByPk(id);
    if (!room) {
      return null;
    }
    return await room.update(roomData, { transaction });
  },
};

export default roomRepo;
