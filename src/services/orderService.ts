import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockOrders } from "@/mocks/mockOrders";
import type { CheckoutPayload, Order, OrderStatus } from "@/types/order.types";

const generate = (payload: CheckoutPayload): Order => {
  const id = `o-${Date.now()}`;
  const now = new Date().toISOString();
  const subtotal = 150000; // placeholder; real calc would lookup products
  return {
    id,
    code: `CNM-${id.slice(-6).toUpperCase()}`,
    customerId: payload.customerId,
    customer: payload.customerName,
    customerPhone: payload.customerPhone,
    marketId: payload.marketId,
    stallIds: Array.from(new Set(payload.items.map((i) => i.stallId))),
    items: payload.items,
    subtotal,
    deliveryFee: 18000,
    serviceFee: 5000,
    total: subtotal + 18000 + 5000,
    status: "confirmed",
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === "cod" ? "pending" : "paid",
    deliveryAddress: payload.deliveryAddress,
    address: payload.deliveryAddress,
    createdAt: now,
    timeline: [{ status: "confirmed", at: now, note: "Đơn được xác nhận" }],
  };
};

registerMock("POST", "/orders", async (_p, body) => {
  const o = generate(body as CheckoutPayload);
  mockOrders.unshift(o);
  return o;
});

registerMock("GET", "/orders/customer/:id", async (p) => {
  const id = p.split("/").pop();
  return mockOrders.filter((o) => o.customerId === id);
});

registerMock("GET", "/orders/:id", async (p) => {
  const id = p.split("/").pop();
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  return o;
});

registerMock("PATCH", "/orders/:id/status", async (p, body) => {
  const id = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const status = (body as { status: OrderStatus }).status;
  o.status = status;
  o.timeline.push({ status, at: new Date().toISOString() });
  return o;
});

registerMock("POST", "/orders/:id/cancel", async (p, body) => {
  const id = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  if (o.status === "completed") throw new ApiError("Đơn đã hoàn tất, không thể huỷ", 400);
  o.status = "cancelled";
  o.timeline.push({ status: "cancelled", at: new Date().toISOString(), note: (body as { reason?: string })?.reason });
  return o;
});

export const orderService = {
  createOrder: (payload: CheckoutPayload) => apiClient.post<Order>("/orders", payload),
  getCustomerOrders: (customerId: string) => apiClient.get<Order[]>(`/orders/customer/${customerId}`),
  getOrderById: (orderId: string) => apiClient.get<Order>(`/orders/${orderId}`),
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId: string, reason?: string) =>
    apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason }),
  getAll: async () => mockOrders,
};
