import { ApiError } from "./apiClient";
import { mockUsers } from "@/mocks/mockUsers";
import { loadJSON, saveJSON, removeKey, STORAGE_KEYS } from "@/lib/storage";
import type { User, UserRole } from "@/types/user.types";

interface Session {
  user: User;
  role: UserRole;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

const KEY = STORAGE_KEYS.session;

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

const DEFAULT_ADDRESSES: SavedAddress[] = [
  { id: "addr-1", label: "Nhà", fullName: "Chị Mai", phone: "0909123456", address: "112 Nguyễn Thị Thập, P. Tân Phú, Q.7, TP.HCM", isDefault: true },
  { id: "addr-2", label: "Công ty", fullName: "Chị Mai", phone: "0909123456", address: "Tòa nhà Sunrise City, Q.7, TP.HCM" },
];

const readAddresses = (): SavedAddress[] => loadJSON(STORAGE_KEYS.addresses, DEFAULT_ADDRESSES);
const writeAddresses = (list: SavedAddress[]) => saveJSON(STORAGE_KEYS.addresses, list);

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
  async getCurrentUser(): Promise<User | null> {
    return readSession()?.user ?? null;
  },
  async updateProfile(patch: Partial<User>): Promise<User> {
    const s = readSession();
    if (!s) throw new ApiError("Chưa đăng nhập", 401);
    const next = { ...s.user, ...patch };
    writeSession({ ...s, user: next });
    return next;
  },
  async logout(): Promise<void> {
    writeSession(null);
    removeKey(STORAGE_KEYS.role);
  },

  // Address book
  listAddresses: async (): Promise<SavedAddress[]> => readAddresses(),
  addAddress: async (a: Omit<SavedAddress, "id">): Promise<SavedAddress> => {
    const next: SavedAddress = { ...a, id: `addr-${Date.now()}` };
    const list = readAddresses();
    if (next.isDefault) list.forEach((x) => (x.isDefault = false));
    writeAddresses([...list, next]);
    return next;
  },
  updateAddress: async (id: string, patch: Partial<SavedAddress>): Promise<SavedAddress> => {
    const list = readAddresses();
    const idx = list.findIndex((a) => a.id === id);
    if (idx < 0) throw new ApiError("Không tìm thấy địa chỉ", 404);
    if (patch.isDefault) list.forEach((x) => (x.isDefault = false));
    list[idx] = { ...list[idx], ...patch };
    writeAddresses(list);
    return list[idx];
  },
  deleteAddress: async (id: string): Promise<void> => {
    writeAddresses(readAddresses().filter((a) => a.id !== id));
  },
};

export type { Session };
