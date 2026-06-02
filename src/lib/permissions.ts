import type { UserRole } from "@/types/user.types";

export type AppArea = "customer" | "vendor" | "driver" | "admin";

export const canAccessArea = (role: UserRole | null, area: AppArea): boolean => {
  if (!role) return false;
  if (role === "admin") return true; // admin can access everything
  return role === area;
};
