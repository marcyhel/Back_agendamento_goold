import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/custom_error";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserPermissions,
  fetchUserReservations,
  fetchUserLogs,
} from "../../services/profile/profile.service";


export const handleGetProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.context?.userId;
    if (!userId) throw new CustomError("User ID is required", 400);

    const profile = await fetchUserProfile(userId);
    res.status(200).json({ userProfile: profile });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.context?.userId;
    if (!userId) throw new CustomError("User ID is required", 400);

    const updated = await updateUserProfile(userId, req.body);
    res.status(200).json({ updatedUser: updated });
  } catch (error) {
    next(error);
  }
};


export const handleGetPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.context?.userId;
    if (!userId) throw new CustomError("User ID is required", 400);

    const permissions = await fetchUserPermissions(userId);
    res.status(200).json({ userPermissions: permissions });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserAgendamentos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.context?.userId;
    if (!userId) throw new CustomError("User ID is required", 400);

    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);

    const reservations = await fetchUserReservations(userId, pagination, filters);
    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

export const handleGetUserLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.context?.userId;
    if (!userId) throw new CustomError("User ID is required", 400);

    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);

    const logs = await fetchUserLogs(userId, pagination, filters);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
