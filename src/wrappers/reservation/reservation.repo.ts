import { Reservation, User, Room } from "../../database/models";
import { ReservationInterface } from "../../interfaces/Reservation.interface";
import { Transaction, Op } from "sequelize";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
  PaginationResult,
} from "../../utils/pagination";

const reservationRepo = {
  getAllReservations: async (): Promise<Reservation[]> => {
    return await Reservation.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName"],
        },
        {
          model: Room,
          as: "room",
          attributes: ["number"],
        },
      ],
    });
  },

  findReservationById: async (id: string): Promise<Reservation | null> => {
    return await Reservation.findByPk(id);
  },

  findReservationsByUserId: async (userId: string): Promise<Reservation[]> => {
    return await Reservation.findAll({
      where: { userId },
    });
  },

  findReservationsByRoomId: async (roomId: string): Promise<Reservation[]> => {
    return await Reservation.findAll({
      where: { roomId },
    });
  },

  findReservationsByRoomIdAndDate: async (
    roomId: string,
    date: string | Date
  ): Promise<Reservation[]> => {
    return await Reservation.findAll({
      where: {
        roomId,
        date,
      },
    });
  },

  createReservation: async (
    reservationData: ReservationInterface,
    transaction?: Transaction
  ): Promise<Reservation> => {
    const reservationDataWithStatus = {
      ...reservationData,
      status: reservationData.status || "pending",
    };
    return await Reservation.create(reservationDataWithStatus, { transaction });
  },

  updateReservationStatus: async (
    id: string,
    status: "pending" | "confirmed" | "cancelled"
  ): Promise<Reservation | null> => {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return null;
    }
    return await reservation.update({ status });
  },

  updateReservation: async (
    id: string,
    reservationData: Partial<ReservationInterface>
  ): Promise<Reservation | null> => {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return null;
    }
    return await reservation.update(reservationData);
  },

  getAllReservationsWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Reservation>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const { search, date, sortBy = "date", sortOrder = "DESC" } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.date = {
        [Op.gte]: targetDate.toISOString().split("T")[0],
        [Op.lt]: nextDay.toISOString().split("T")[0],
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$user.last_name$": { [Op.like]: `%${search}%` } },
        { "$room.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "role"],
        required: false,
      },
      {
        model: Room,
        as: "room",
        attributes: ["name"],
        required: false,
      },
    ];

    const { count, rows } = await Reservation.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      subQuery: false,
      logging: console.log,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  getReservationsByUserIdWithPagination: async (
    userId: string,
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Reservation>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const { search, date, sortBy = "date", sortOrder = "DESC" } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.date = {
        [Op.gte]: targetDate.toISOString().split("T")[0],
        [Op.lt]: nextDay.toISOString().split("T")[0],
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$user.last_name$": { [Op.like]: `%${search}%` } },
        { "$room.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "role"],
        required: false,
      },
      {
        model: Room,
        as: "room",
        attributes: ["name"],
        required: false,
      },
    ];

    const { count, rows } = await Reservation.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      subQuery: false,
      logging: console.log,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  findReservationsByRoomIdAndStatus: async (
    roomId: string,
    statuses: ("pending" | "confirmed" | "cancelled")[]
  ): Promise<Reservation[]> => {
    return await Reservation.findAll({
      where: {
        roomId,
        status: {
          [Op.in]: statuses,
        },
      },
    });
  },

  findReservationsByRoomIdStatusAndDate: async (
    roomId: string,
    statuses: ("pending" | "confirmed" | "cancelled")[],
    fromDate: Date
  ): Promise<Reservation[]> => {
    return await Reservation.findAll({
      where: {
        roomId,
        status: {
          [Op.in]: statuses,
        },
        date: {
          [Op.gte]: fromDate,
        },
      },
    });
  },

  findConflictingReservations: async (
    roomId: string,
    date: Date | string,
    time: string,
    excludeReservationId?: string
  ): Promise<Reservation[]> => {
    const whereClause: any = {
      roomId,
      date,
      time,
      status: {
        [Op.in]: ["pending", "confirmed"],
      },
    };

    if (excludeReservationId) {
      whereClause.id = {
        [Op.ne]: excludeReservationId,
      };
    }

    return await Reservation.findAll({
      where: whereClause,
    });
  },

  cancelMultipleReservations: async (
    reservationIds: string[],
    transaction?: Transaction
  ): Promise<number> => {
    const [updatedCount] = await Reservation.update(
      { status: "cancelled" },
      {
        where: {
          id: {
            [Op.in]: reservationIds,
          },
        },
        transaction,
      }
    );
    return updatedCount;
  },
};
export default reservationRepo;
