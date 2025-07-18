import { Request, Response, NextFunction } from "express";
import LogService from "../../services/log/log.service";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

export const fetchAllLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);
    const logs = await LogService.getAll(pagination, filters);

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

export const fetchLogsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);

    const logs = await LogService.getByUser(userId, pagination, filters);

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

export const fetchMyLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.context?.userId;

    if (!currentUserId) {
      res.status(401).json({ error: "Unauthorized access" });
    }

    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);

    const logs = await LogService.getByUser(currentUserId, pagination, filters);

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};
