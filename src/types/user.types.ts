export type UserRole = "customer" | "vendor" | "driver" | "admin";
export type UserStatus = "active" | "pending" | "suspended";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  status: UserStatus;
}
