import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockDrivers } from "@/mocks/mockDrivers";
import { mockOrders } from "@/mocks/mockOrders";
import type { Driver, DeliveryStatus } from "@/types/delivery.types";
import type { Order } from "@/types/order.types";

registerMock("GET", "/delivery/available-drivers/:orderId", async () => {
  return mockDrivers.filter((d) => d.isOnline && d.verificationStatus === "verified");
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
  o.timeline.push({ status: "picking", at: new Date().toISOString() });
  return o;
});

registerMock("PATCH", "/delivery/:orderId/pickup/:stallId", async (p, body) => {
  const orderId = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  // mock: just append to timeline
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
  if (!otp || otp.length < 4) throw new ApiError("Mã OTP không hợp lệ", 400);
  o.status = "completed";
  o.paymentStatus = "paid";
  o.timeline.push({ status: "completed", at: new Date().toISOString(), note: "Khách xác nhận OTP" });
  return o;
});

export const deliveryService = {
  findAvailableDrivers: (orderId: string) =>
    apiClient.get<Driver[]>(`/delivery/available-drivers/${orderId}`),
  assignDriver: (orderId: string, driverId: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/assign`, { driverId }),
  acceptTrip: (driverId: string, orderId: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/accept`, { driverId }),
  updatePickupStatus: (orderId: string, stallId: string, status: "picked" | "missing") =>
    apiClient.patch<Order>(`/delivery/${orderId}/pickup/${stallId}`, { status }),
  updateDeliveryStatus: (orderId: string, status: DeliveryStatus) =>
    apiClient.patch<Order>(`/delivery/${orderId}/status`, { status }),
  confirmDelivery: (orderId: string, otp: string) =>
    apiClient.post<Order>(`/delivery/${orderId}/confirm`, { otp }),
};
