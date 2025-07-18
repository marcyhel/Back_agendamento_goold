import { z } from "zod/v4";
import { Auth, SignUp } from "../../interfaces/Auth.interface";

export const validateSignIn = (userData: Auth) => {
  const schema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  return schema.safeParse(userData);
};

export const validateSignUp = (userData: SignUp) => {
  const schema = z.object({
    user: z.object({
      name: z.string().min(1, "Name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.email("Invalid email format"),
      role: z
        .enum(["user", "admin"], "Role must be either 'user' or 'admin'")
        .optional(),
      status: z.enum(
        ["active", "inactive"],
        "Status must be either 'active' or 'inactive'"
      ),
      canViewLogs: z.boolean(),
      canManageScheduling: z.boolean(),
    }),
    address: z.object({
      cep: z.string().min(1, "CEP is required"),
      number: z.string().min(1, "Number is required"),
      street: z.string().min(1, "Street is required"),
      neighborhood: z.string().min(1, "Neighborhood is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
    }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  });

  return schema.safeParse(userData);
};
