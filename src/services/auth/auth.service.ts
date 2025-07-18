import { SignUp, Auth } from "../../interfaces/Auth.interface";
import { CustomError } from "../../utils/custom_error";
import config from "../../config/config";
import { compareSync, hash } from "bcrypt";
import authRepo from "../../wrappers/auth/auth.repo";
import {
  validateSignUp,
  validateSignIn,
} from "../../wrappers/auth/auth.validator";
import { generateJWT } from "../../middlewares/jwt.service";
import LogService from "../log/log.service";

export const registerUserService = async (input: SignUp) => {
  const validation = validateSignUp(input);
  if (validation.error) {
    console.error('Validation error:', validation.error);
    throw new CustomError(validation.error.message, 400);
  }

  const userExists = await authRepo.findUserByEmail(input.user.email);
  if (userExists) {
    throw new CustomError("User already exists", 409);
  }

  if (!input.password || input.password.length < 6) {
    throw new CustomError("Password must be at least 6 characters long", 400);
  }

  const hashedPassword = await hash(input.password, 10);
  input.user.role = "user";

  const createdUser = await authRepo.createUser(input, hashedPassword);
  if (!createdUser) {
    throw new CustomError("Failed to create user", 500);
  }

  const tokenPayload = {
    userId: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    canViewLogs: createdUser.canViewLogs,
    canManageScheduling: createdUser.canManageScheduling,
  };

  LogService.registerActivity(
    createdUser.id,
    "account",
    "Criar conta",
    `User ${createdUser.email} signed up successfully`,
    undefined
  );

  const token = await generateJWT(
    tokenPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string
  );

  return { accessToken: token };
};

export const authenticateUserService = async (credentials: Auth) => {
  const validation = validateSignIn(credentials);
  if (validation.error) {
    throw new CustomError(validation.error.message, 400);
  }

  const foundUser = await authRepo.findUserByEmail(credentials.email);
  if (!foundUser) {
    throw new CustomError("User not found", 404);
  }

  if (foundUser.status !== "active") {
    throw new CustomError("User is not active", 403);
  }

  // Uncomment if user role check is necessary
  // if (foundUser.role !== "user") {
  //   throw new CustomError("Only regular users can sign in", 403);
  // }

  const storedPassword = await authRepo.getUserPassword(foundUser.id);
  if (!storedPassword) {
    throw new CustomError("User password not found", 404);
  }

  const passwordIsValid = compareSync(credentials.password, storedPassword.passwordHash);
  if (!passwordIsValid) {
    throw new CustomError("Email or password is invalid", 401);
  }

  const jwtPayload = {
    userId: foundUser.id,
    email: foundUser.email,
    role: foundUser.role,
    name: foundUser.name,
    lastName: foundUser.lastName,
    canViewLogs: foundUser.canViewLogs,
    canManageScheduling: foundUser.canManageScheduling,
  };

  LogService.registerActivity(
    foundUser.id,
    "account",
    "Login",
    `User ${foundUser.email} signed in successfully`,
    undefined
  );

  const token = await generateJWT(
    jwtPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string
  );

  return { accessToken: token };
};

export const authenticateAdminService = async (credentials: Auth) => {
  const validationResult = validateSignIn(credentials);
  if (validationResult.error) {
    throw new CustomError(validationResult.error.message, 400);
  }

  const adminUser = await authRepo.findUserByEmail(credentials.email);
  if (!adminUser) {
    throw new CustomError("User not found", 404);
  }

  if (adminUser.status !== "active") {
    throw new CustomError("User is not active", 403);
  }

  // Uncomment for role check
  // if (adminUser.role !== "admin") {
  //   throw new CustomError("Only admin users can sign in", 403);
  // }

  const passwordData = await authRepo.getUserPassword(adminUser.id);
  if (!passwordData) {
    throw new CustomError("User password not found", 404);
  }

  const passwordMatches = compareSync(credentials.password, passwordData.passwordHash);
  if (!passwordMatches) {
    throw new CustomError("Email or password is invalid", 401);
  }

  const jwtData = {
    userId: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
    name: adminUser.name,
    lastName: adminUser.lastName,
    canViewLogs: adminUser.canViewLogs,
    canManageScheduling: adminUser.canManageScheduling,
  };

  LogService.registerActivity(
    adminUser.id,
    "account",
    "Login",
    `User ${adminUser.email} signed in successfully`,
    undefined
  );

  const accessToken = await generateJWT(
    jwtData,
    config.JWT_ACCESS_TOKEN_SECRET as string
  );

  return { accessToken };
};

export const emailExistsCheckService = async (email: string) => {
  const existing = await authRepo.findUserByEmail(email);
  if (!existing) {
    throw new CustomError("User not found", 404);
  }

  if (existing.role !== "user") {
    throw new CustomError("Only regular users can check email", 403);
  }

  return { exists: true };
};