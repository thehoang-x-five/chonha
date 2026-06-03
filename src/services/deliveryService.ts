import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockDrivers } from "@/mocks/mockDrivers";
import { mockOrders } from "@/mocks/mockOrders";
import type { Driver, DeliveryStatus } from "@/types/delivery.types";
import type { Order } from "@/types/order.types";

const declinedKey = (driverId: string) => `cnm.driver.${driverId}.declined`;
const readDeclined = (driverId: string): string[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(declinedKey(driverId)) || "[]"); } catch { return []; }
};
const writeDeclined = (driverId: string, list: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(declinedKey(driverId), JSON.stringify(list));
};

registerMock("GET", "/delivery/available-drivers/:orderId", async () => {
  return mockDrivers.filter((d) => d.isOnline && d.verificationStatus === "verified");
});

registerMock("GET", "/delivery/driver/:driverId/available", async (p) => {
  const driverId = p.split("/")[3];
  const declined = new Set(readDeclined(driverId));
  return (
    mockOrders.find(
      (o) =>
        ["finding_driver", "driver_assigned"].includes(o.status) &&
        !declined.has(o.id) &&
        (!o.driverId || o.driverId === driverId),
    ) ?? null
  );
});

registerMock("POST", "/delivery/:orderId/decline", async (p, body) => {
  const orderId = p.split("/")[2];
  const driverId = (body as { driverId: string }).driverId;
  const cur = readDeclined(driverId);
  if (!cur.includes(orderId)) writeDeclined(driverId, [...cur, orderId]);
  return { ok: true };
});

registerMock("POST", "/delivery/:orderId/assign", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const driverId = (body as { driverId: string }).driverId;
  o.driverId = driverId;
  o.status = "driver_assigned";
  o.timeline.push({ status: "driver_assigned", at: new Date().toISOString() });
  return o;
});

registerMock("POST", "/delivery/:orderId/accept", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  o.driverId = (body as { driverId: string }).driverId;
  o.status = "picking";
  o.timeline.push({ status: "picking", at: new Date().toISOString(), note: "Tài xế nhận cuốc" });
  return o;
});

registerMock("PATCH", "/delivery/:orderId/pickup/:stallId", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  o.timeline.push({
    status: o.status,
    at: new Date().toISOString(),
    note: `Đã lấy hàng tại sạp ${p.split("/")[4]} (${(body as { status: string }).status})`,
  });
  return o;
});

registerMock("PATCH", "/delivery/:orderId/status", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const s = (body as { status: DeliveryStatus }).status;
  if (s === "delivered") o.status = "completed";
  else if (s === "to_customer") o.status = "delivering";
  o.timeline.push({ status: o.status, at: new Date().toISOString() });
  return o;
});

registerMock("POST", "/delivery/:orderId/confirm", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const otp = (body as { otp: string }).otp;
  if (!/^\d{4}$/.test(otp)) throw new ApiError("Mã OTP gồm 4 chữ số.", 400);
  if (otp !== "1234") throw new ApiError("Mã OTP chưa đúng. Khách có thể tìm mã trong mục Đơn đang giao.", 400);
  o.status = "completed";
  o.paymentStatus = "paid";
  o.timeline.push({ status: "completed", at: new Date().toISOString(), note: "Khách xác nhận OTP" });
  return o;
});

registerMock("POST", "/delivery/:orderId/issue", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const reason = (body as { reason: string }).reason ?? "Sự cố chưa rõ";
  o.timeline.push({ status: o.status, at: new Date().toISOString(), note: `Báo sự cố: ${reason}` });
  return { ok: true };
});

export const deliveryService = {
  findAvailableDrivers: (orderId: string) =>
    apiClient.get<Driver[]>(`/delivery/available-drivers/${orderId}`),
  getAvailableTripForDriver: (driverId: string) =>
    apiClient.get<Order | null>(`/delivery/driver/${driverId}/available`),
  declineTrip: (orderId: string, driverId: string) =>
    apiClient.post<{ ok: true }>(`/delivery/${orderId}/decline`, { driverId }),
  assignDriver: (orderId: string, driverId: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/assign`, { driverId }),
  acceptTrip: (driverId: string, orderId: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/accept`, { driverId }),
  updatePickupStatus: (orderId: string, stallId: string, status: "picked" | "missing") =>
    apiClient.patch<Order>(`/delivery/${orderId}/pickup/${stallId}`, { status }),
  confirmPickup: (orderId: string, stallId: string) =>
    apiClient.patch<Order>(`/delivery/${orderId}/pickup/${stallId}`, { status: "picked" }),
  updateDeliveryStatus: (orderId: string, status: DeliveryStatus) =>
    apiClient.patch<Order>(`/delivery/${orderId}/status`, { status }),
  confirmDelivery: (orderId: string, otp: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/confirm`, { otp }),
  reportIssue: (orderId: string, reason: string) =>
    apiClient.post<{ ok: true }>(`/delivery/${orderId}/issue`, { reason }),
};
