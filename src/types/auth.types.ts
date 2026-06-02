import type { User, UserRole } from "./user.types";

export interface AuthSession {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

export interface OtpRequest {
  phone: string;
}

export interface OtpVerify {
  phone: string;
  code: string;
  role: UserRole;
}
