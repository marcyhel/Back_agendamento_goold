import { Log, User } from "../../database/models";
import { LogInterface } from "../../interfaces/Log.interface";
import { Transaction, Op, fn, col, where } from "sequelize";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
  PaginationResult,
} from "../../utils/pagination";
import { getUtcRangeFromBrDate } from "../../utils/timezone";
import LogService from "../../services/log/log.service";

const logRepo = {
  createLog: async (
    logData: LogInterface,
    transaction?: Transaction
  ): Promise<Log> => {
    return await Log.create(logData, { transaction });
  },

  getAllLogsWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Log>> => {
    const { page = 1, limit = 50 } = paginationParams;
    const {
      search,
      date,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "email"],
        required: false,
      },
    ];

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;

      whereClause[Op.or] = [
        { activity: { [Op.like]: searchLower } },
        { module: { [Op.like]: searchLower } },
        where(fn("LOWER", col("user.name")), {
          [Op.like]: searchLower,
        }),
        where(fn("LOWER", col("user.last_name")), {
          [Op.like]: searchLower,
        }),
        where(fn("LOWER", col("user.email")), {
          [Op.like]: searchLower,
        }),
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.createdAt = {
        [Op.gte]: targetDate,
        [Op.lt]: nextDay,
      };
    }

    const { count, rows } = await Log.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  getLogsByUserIdWithPagination: async (
    userId: string,
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Log>> => {
    const { page = 1, limit = 50 } = paginationParams;
    const {
      search,
      date,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "email"],
        required: false,
      },
    ];

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;

      whereClause[Op.or] = [
        { activity: { [Op.like]: searchLower } },
        { module: { [Op.like]: searchLower } },
        where(fn("LOWER", col("user.name")), {
          [Op.like]: searchLower,
        }),
        where(fn("LOWER", col("user.last_name")), {
          [Op.like]: searchLower,
        }),
        where(fn("LOWER", col("user.email")), {
          [Op.like]: searchLower,
        }),
      ];
    }

    if (date) {
      const { start, end } = getUtcRangeFromBrDate(date);
      whereClause.createdAt = {
        [Op.gte]: start,
        [Op.lt]: end,
      };


    }

    const { count, rows } = await Log.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    await LogService.registerActivity(
      userId,
      "account",
      "Visualização de Logs",
      `Consulta todos os logs`
    );


    return createPaginationResult(rows, count, page, limit);
  },

  getLogsByUserId: async (userId: string): Promise<Log[]> => {
    return await Log.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
  },

  getLogsByModule: async (module: string): Promise<Log[]> => {
    return await Log.findAll({
      where: { module },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
  },

  getLogsByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<Log[]> => {
    return await Log.findAll({
      where: {
        createdAt: {
          $between: [startDate, endDate],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },
};

export default logRepo;
