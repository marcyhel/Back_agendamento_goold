import { Address } from "./Address.interface";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role?: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs?: boolean;
  canManageScheduling?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  hasPermission(permission: "logs" | "scheduling"): boolean;
}

interface CreateUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs: boolean;
  canManageScheduling: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  hasPermission(permission: "logs" | "scheduling"): boolean;
}

interface UserAddress {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs: boolean;
  canManageScheduling: boolean;
  addressId?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EditUser {
  user: {
    name: string;
    lastName: string;
    email: string;
  };
  address: {
    cep: string;
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  password?: string;
}

export { User, UserAddress, CreateUser, EditUser };
