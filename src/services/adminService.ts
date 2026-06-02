import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockMarkets } from "@/mocks/mockMarkets";
import { mockStalls } from "@/mocks/mockStalls";
import { mockOrders } from "@/mocks/mockOrders";
import { mockDrivers } from "@/mocks/mockDrivers";
import type { DashboardStats } from "@/types/admin.types";
import type { Order } from "@/types/order.types";
import type { Stall } from "@/types/stall.types";
import type { Driver } from "@/types/delivery.types";
import type { Market } from "@/types/market.types";

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

export const adminService = {
  getDashboardStats: () => apiClient.get<DashboardStats>("/admin/dashboard"),
  getAllOrders: async (): Promise<Order[]> => mockOrders,
  getAllMarkets: async (): Promise<Market[]> => mockMarkets,
  getAllStalls: async (): Promise<Stall[]> => mockStalls,
  approveStall: (stallId: string) => apiClient.post<Stall>(`/admin/stalls/${stallId}/approve`),
  rejectStall: (stallId: string, reason: string) =>
    apiClient.post<Stall>(`/admin/stalls/${stallId}/reject`, { reason }),
  getDrivers: async (): Promise<Driver[]> => mockDrivers,
  verifyDriver: (driverId: string) => apiClient.post<Driver>(`/admin/drivers/${driverId}/verify`),
  suspendDriver: (driverId: string) => apiClient.post<Driver>(`/admin/drivers/${driverId}/suspend`),
};
