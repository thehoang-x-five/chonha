import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockMarkets } from "@/mocks/mockMarkets";
import { mockStalls } from "@/mocks/mockStalls";
import { mockOrders } from "@/mocks/mockOrders";
import { mockDrivers } from "@/mocks/mockDrivers";
import { mockPayments } from "@/mocks/mockPayments";
import { loadJSON, saveJSON, STORAGE_KEYS, resetAllDemoData } from "@/lib/storage";
import type { DashboardStats } from "@/types/admin.types";
import type { Order, OrderStatus } from "@/types/order.types";
import type { Stall } from "@/types/stall.types";
import type { Driver } from "@/types/delivery.types";
import type { Market } from "@/types/market.types";

export interface AppSettings {
  deliveryFeeBase: number;
  serviceFee: number;
  platformCommissionPercent: number;
  driverCommissionPercent: number;
  supportHotline: string;
  voucherCode: string;
  voucherDiscountPercent: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  deliveryFeeBase: 18000,
  serviceFee: 5000,
  platformCommissionPercent: 8,
  driverCommissionPercent: 12,
  supportHotline: "1900 1234",
  voucherCode: "TUOI10",
  voucherDiscountPercent: 10,
};

const readSettings = (): AppSettings => loadJSON(STORAGE_KEYS.appSettings, DEFAULT_SETTINGS);

registerMock("GET", "/admin/dashboard", async (): Promise<DashboardStats> => {
  return {
    todayOrders: mockOrders.length,
    todayRevenue: mockOrders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0) + 12500000,
    activeStalls: mockStalls.filter((s) => s.isOpen).length,
    onlineDrivers: mockDrivers.filter((d) => d.isOnline).length,
    deliveryIssues: 2,
    ordersTrend: [42, 51, 38, 64, 72, 58, 81],
    revenueTrend: [12, 16, 11, 19, 22, 18, 26],
  };
});

registerMock("POST", "/admin/stalls/:id/approve", async (p) => {
  const id = p.split("/")[3];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.approvalStatus = "approved";
  return s;
});
registerMock("POST", "/admin/stalls/:id/reject", async (p) => {
  const id = p.split("/")[3];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.approvalStatus = "rejected";
  return s;
});

registerMock("POST", "/admin/drivers/:id/verify", async (p) => {
  const id = p.split("/")[3];
  const d = mockDrivers.find((x) => x.id === id);
  if (!d) throw new ApiError("Không tìm thấy tài xế", 404);
  d.verificationStatus = "verified";
  return d;
});
registerMock("POST", "/admin/drivers/:id/suspend", async (p) => {
  const id = p.split("/")[3];
  const d = mockDrivers.find((x) => x.id === id);
  if (!d) throw new ApiError("Không tìm thấy tài xế", 404);
  d.verificationStatus = "suspended";
  d.isOnline = false;
  d.online = false;
  return d;
});

registerMock("POST", "/admin/orders/:id/refund", async (p) => {
  const id = p.split("/")[3];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  o.paymentStatus = "refunded";
  const pay = mockPayments.find((x) => x.orderId === id);
  if (pay) pay.status = "refunded";
  o.timeline.push({ status: o.status, at: new Date().toISOString(), note: "Đã hoàn tiền (mô phỏng)" });
  return o;
});

registerMock("POST", "/admin/orders/:id/assign-driver", async (p, body) => {
  const id = p.split("/")[3];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  o.driverId = (body as { driverId: string }).driverId;
  if (o.status === "finding_driver" || o.status === "confirmed" || o.status === "ready_for_pickup") {
    o.status = "driver_assigned";
  }
  o.timeline.push({ status: "driver_assigned", at: new Date().toISOString(), note: "Quản trị viên gán tài xế" });
  return o;
});

registerMock("PATCH", "/admin/orders/:id/status", async (p, body) => {
  const id = p.split("/")[3];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const s = (body as { status: OrderStatus }).status;
  o.status = s;
  o.timeline.push({ status: s, at: new Date().toISOString(), note: "Quản trị viên cập nhật" });
  return o;
});

// Settings
registerMock("GET", "/admin/settings", async () => readSettings());
registerMock("PUT", "/admin/settings", async (_p, body) => {
  const merged = { ...readSettings(), ...(body as Partial<AppSettings>) };
  saveJSON(STORAGE_KEYS.appSettings, merged);
  return merged;
});

// Dispatch scoring — mock weighted score.
const stableHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
const fakeDistanceKm = (driverId: string, orderId: string) =>
  +(((stableHash(driverId + orderId) % 60) / 10 + 0.5).toFixed(1)); // 0.5–6.5

export interface DispatchScore {
  distance: number; // 0–100
  workload: number;
  rating: number;
  vehicle: number;
  total: number;
  distanceKm: number;
}

const computeScore = (driver: Driver, order: Order): DispatchScore => {
  const distanceKm = fakeDistanceKm(driver.id, order.id);
  const distance = Math.max(0, 100 - distanceKm * 14);
  const workload = Math.max(20, 100 - (driver.trips % 5) * 12);
  const rating = (driver.rating / 5) * 100;
  const v = driver.vehicle.toLowerCase();
  const vehicle = v.includes("lead") || v.includes("wave") || v.includes("sirius") ? 95 : 80;
  const total = Math.round(distance * 0.4 + workload * 0.25 + rating * 0.2 + vehicle * 0.15);
  return { distance: Math.round(distance), workload: Math.round(workload), rating: Math.round(rating), vehicle, total, distanceKm };
};

export const adminService = {
  getDashboardStats: () => apiClient.get<DashboardStats>("/admin/dashboard"),
  getAllOrders: async (): Promise<Order[]> => mockOrders,
  getAllMarkets: async (): Promise<Market[]> => mockMarkets,
  getAllStalls: async (): Promise<Stall[]> => mockStalls,
  getDrivers: async (): Promise<Driver[]> => mockDrivers,
  approveStall: (stallId: string) => apiClient.post<Stall>(`/admin/stalls/${stallId}/approve`),
  rejectStall: (stallId: string, reason: string) =>
    apiClient.post<Stall>(`/admin/stalls/${stallId}/reject`, { reason }),
  verifyDriver: (driverId: string) => apiClient.post<Driver>(`/admin/drivers/${driverId}/verify`),
  suspendDriver: (driverId: string, _reason?: string) =>
    apiClient.post<Driver>(`/admin/drivers/${driverId}/suspend`),
  refund: (orderId: string) => apiClient.post<Order>(`/admin/orders/${orderId}/refund`),
  assignDriver: (orderId: string, driverId: string) =>
    apiClient.post<Order>(`/admin/orders/${orderId}/assign-driver`, { driverId }),
  forceStatus: (orderId: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/admin/orders/${orderId}/status`, { status }),

  // Dispatch
  listWaitingOrders: async () =>
    mockOrders.filter((o) => ["confirmed", "finding_driver", "ready_for_pickup"].includes(o.status)),
  listAvailableDrivers: async () =>
    mockDrivers.filter((d) => d.isOnline && d.verificationStatus === "verified"),
  computeScore,
  rankDriversForOrder: async (orderId: string): Promise<Array<{ driver: Driver; score: DispatchScore }>> => {
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) return [];
    const drivers = mockDrivers.filter((d) => d.isOnline && d.verificationStatus === "verified");
    return drivers
      .map((d) => ({ driver: d, score: computeScore(d, order) }))
      .sort((a, b) => b.score.total - a.score.total);
  },

  // Settings + demo reset
  getSettings: () => apiClient.get<AppSettings>("/admin/settings"),
  saveSettings: (patch: Partial<AppSettings>) => apiClient.put<AppSettings>("/admin/settings", patch),
  resetDemoData: async () => {
    resetAllDemoData();
    return { ok: true as const };
  },
};

export { DEFAULT_SETTINGS };
