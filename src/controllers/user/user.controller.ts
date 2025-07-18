import { Request, Response, NextFunction } from "express";
import {
  fetchUsersWithPagination,
  fetchUserById,
  fetchUserPermissionsById,
  modifyUserPermissions,
  toggleUserStatus,
} from "../../services/user/user.service";
import {
  getPaginationParams,
  getFilterParams,
} from "../../utils/pagination";

export const handleGetUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pagination = getPaginationParams(req.query);
    const filters = getFilterParams(req.query);
    const users = await fetchUsersWithPagination(pagination, filters);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const handleGetUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await fetchUserById(userId);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const handleGetUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const permissions = await fetchUserPermissionsById(userId);
    res.status(200).json({ userPermissions: permissions });
  } catch (err) {
    next(err);
  }
};

export const handleUpdatePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;
    const updated = await modifyUserPermissions(userId, permissions);
    res.status(200).json({ updatedUser: updated });
  } catch (err) {
    next(err);
  }
};

export const handleChangeUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const updated = await toggleUserStatus(userId, status);
    res.status(200).json({ updatedUser: updated });
  } catch (err) {
    next(err);
  }
};
