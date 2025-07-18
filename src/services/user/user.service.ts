import userRepo from "../../wrappers/user/user.repo";
import { validatePermission } from "../../wrappers/user/user.validator";
import { CustomError } from "../../utils/custom_error";
import {
  PaginationParams,
  FilterParams,
} from "../../utils/pagination";

export const fetchUsersWithPagination = async (
  pagination: PaginationParams,
  filters: FilterParams
) => {
  try {
    return await userRepo.getAllUsersWithPagination(pagination, filters);
  } catch {
    throw new CustomError("Failed to retrieve users", 500);
  }
};

export const fetchUserById = async (id: string) => {
  try {
    if (!id) throw new CustomError("User ID is required", 400);

    const user = await userRepo.findUserById(id);
    if (!user) throw new CustomError("User not found", 404);

    return user;
  } catch {
    throw new CustomError("Failed to retrieve user", 500);
  }
};

export const fetchUserPermissionsById = async (id: string) => {
  try {
    if (!id) throw new CustomError("User ID is required", 400);

    const permissions = await userRepo.findPermissionsByUserId(id);
    if (!permissions) throw new CustomError("User permissions not found", 404);

    return permissions;
  } catch {
    throw new CustomError("Failed to retrieve user permissions", 500);
  }
};

export const modifyUserPermissions = async (
  id: string,
  perms: { canViewLogs?: boolean; canManageScheduling?: boolean }
) => {
  try {
    if (!id) throw new CustomError("User ID is required", 400);
    console.log(id, perms)
    const { error } = validatePermission({ permissions: perms });
    if (error) throw new CustomError(error.message, 400);
    console.log(id, perms)
    const updated = await userRepo.editUserPermissions(id, perms);
    if (!updated) throw new CustomError("Failed to update user permissions", 404);

    return updated;
  } catch {
    throw new CustomError("Failed to update user permissions", 500);
  }
};

export const toggleUserStatus = async (
  id: string,
  status: "active" | "inactive"
) => {
  try {
    if (!id) throw new CustomError("User ID is required", 400);

    const result = await userRepo.changeUserStatus(id, status);
    if (!result) throw new CustomError("Failed to change user status", 404);

    return result;
  } catch {
    throw new CustomError("Failed to change user status", 500);
  }
};
