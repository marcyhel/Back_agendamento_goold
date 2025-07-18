import { Request } from "express";
import logRepo from "../../wrappers/logs/logs.repo";
import { LogInterface } from "../../interfaces/Log.interface";
import { CustomError } from "../../utils/custom_error";
import { PaginationParams, FilterParams } from "../../utils/pagination";

class LogService {
  static async record(log: LogInterface): Promise<void> {
    try {
      await logRepo.createLog(log);
    } catch (err) {
      console.error("Error while saving log:", err);
    }
  }

  static async registerActivity(
    userId: string,
    module: "account" | "reservation",
    action: string,
    description?: string,
    req?: Request
  ): Promise<void> {
    const logEntry: LogInterface = {
      userId,
      module,
      activity: action,
      details: description,
    };

    await this.record(logEntry);
  }

  static async getAll(
    pagination: PaginationParams,
    filters: FilterParams
  ) {
    try {
      return await logRepo.getAllLogsWithPagination(pagination, filters);
    } catch (err) {
      throw new CustomError("Unable to fetch logs", 500);
    }
  }

  static async getByUser(
    userId: string,
    pagination: PaginationParams,
    filters: FilterParams
  ) {
    if (!userId) {
      throw new CustomError("Missing user identifier", 400);
    }

    try {
      return await logRepo.getLogsByUserIdWithPagination(userId, pagination, filters);
    } catch (err) {
      throw new CustomError("Unable to fetch user logs", 500);
    }
  }

  static async getByModule(moduleName: string) {
    try {
      return await logRepo.getLogsByModule(moduleName);
    } catch (err) {
      throw new CustomError("Unable to fetch module logs", 500);
    }
  }
}

export default LogService;
