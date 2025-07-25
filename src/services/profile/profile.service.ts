import { hash } from "bcrypt";
import { EditUser } from "../../interfaces/User.interface";
import { CustomError } from "../../utils/custom_error";

import userRepo from "../../wrappers/user/user.repo";
import reservationRepo from "../../wrappers/reservation/reservation.repo";
import logRepo from "../../wrappers/logs/logs.repo";
import LogService from "../log/log.service";

import { PaginationParams, FilterParams } from "../../utils/pagination";


export const fetchUserProfile = async (userId: string) => {
  if (!userId) throw new CustomError("User ID is required", 400);

  const user = await userRepo.findUserById(userId);
  if (!user) throw new CustomError("User not found", 404);

  return user;
};


export const updateUserProfile = async (userId: string, userData: EditUser) => {
  if (!userId) throw new CustomError("User ID is required", 400);

  if (userData.user.email?.trim()) {
    throw new CustomError("It is not possible to change the email", 400);
  }

  if (userData.password?.trim()) {
    if (userData.password.length < 6) {
      throw new CustomError("Password must be at least 6 characters long", 400);
    }
    userData.password = await hash(userData.password, 10);
  } else {
    delete userData.password;
  }

  const updated = await userRepo.updateUserProfile(userId, userData);
  if (!updated) throw new CustomError("Failed to update user profile", 404);

  await LogService.registerActivity(
    userId,
    "account",
    "Perfil atualizado",
    `User ${updated.user.email} updated profile successfully`
  );


  return updated;
};


export const fetchUserPermissions = async (userId: string) => {
  if (!userId) throw new CustomError("User ID is required", 400);

  const permissions = await userRepo.findPermissionsByUserId(userId);
  if (!permissions) throw new CustomError("User permissions not found", 404);

  return permissions;
};


export const fetchUserReservations = async (
  userId: string,
  pagination: PaginationParams,
  filters: FilterParams
) => {
  if (!userId) throw new CustomError("User ID is required", 400);

  return reservationRepo.getReservationsByUserIdWithPagination(userId, pagination, filters);
};

export const fetchUserLogs = async (
  userId: string,
  pagination: PaginationParams,
  filters: FilterParams
) => {
  if (!userId) throw new CustomError("User ID is required", 400);

  return logRepo.getLogsByUserIdWithPagination(userId, pagination, filters);
};

