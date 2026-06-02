import { ApiError } from "./apiClient";
import { mockUsers } from "@/mocks/mockUsers";
import type { User, UserRole } from "@/types/user.types";

const KEY = "cnm-session-v1";

interface Session {
  user: User;
  role: UserRole;
}

const readSession = (): Session | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};
const writeSession = (s: Session | null) => {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("cnm-auth"));
};

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async requestOtp(phone: string): Promise<{ ok: true }> {
    await wait();
    if (!/^0\d{8,10}$/.test(phone)) throw new ApiError("Số điện thoại không hợp lệ", 400);
    return { ok: true };
  },
  async verifyOtp(phone: string, code: string, role: UserRole): Promise<Session> {
    await wait();
    if (code.length < 4) throw new ApiError("Mã OTP không đúng", 400);
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    const session: Session = { user: { ...user, phone }, role };
    writeSession(session);
    return session;
  },
  async loginAsRole(role: UserRole): Promise<Session> {
    await wait(50);
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    const session: Session = { user, role };
    writeSession(session);
    return session;
  },
  async getCurrentSession(): Promise<Session | null> {
    return readSession();
  },
  async logout(): Promise<void> {
    writeSession(null);
  },
};

export type { Session };
