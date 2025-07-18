import { z } from "zod/v4";

interface Permission {
  permissions: { canViewLogs?: boolean; canManageScheduling?: boolean };
}

export const validatePermission = (userPermission: Permission) => {
  const schema = z.object({
    permissions: z.object({
      canViewLogs: z.boolean().optional(),
      canManageScheduling: z.boolean().optional(),
    }),
  });
  return schema.safeParse(userPermission);
};
