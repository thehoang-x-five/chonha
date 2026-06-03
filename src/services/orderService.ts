import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockOrders } from "@/mocks/mockOrders";
import { mockProducts } from "@/mocks/mockProducts";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import type { CheckoutPayload, Order, OrderStatus } from "@/types/order.types";

// Hydrate persisted orders into the in-memory mock array.
(() => {
  if (typeof window === "undefined") return;
  const persisted = loadJSON<Order[]>(STORAGE_KEYS.orders, []);
  if (persisted.length) {
    // Prepend persisted, then any seed ones not already there.
    const seenIds = new Set(persisted.map((o) => o.id));
    for (let i = mockOrders.length - 1; i >= 0; i--) {
      if (!seenIds.has(mockOrders[i].id)) persisted.push(mockOrders[i]);
    }
    mockOrders.length = 0;
    mockOrders.push(...persisted);
  }
})();

const persist = () => saveJSON(STORAGE_KEYS.orders, mockOrders);

const computeTotals = (payload: CheckoutPayload) => {
  const subtotal = payload.items.reduce((s, it) => {
    const p = mockProducts.find((x) => x.id === it.productId);
    return s + (p ? p.price * it.qty : 0);
  }, 0);
  const deliveryFee = 18000;
  const serviceFee = 5000;
  return { subtotal, deliveryFee, serviceFee, total: subtotal + deliveryFee + serviceFee };
};

const generate = (payload: CheckoutPayload): Order => {
  const id = `o-${Date.now()}`;
  const now = new Date().toISOString();
  const { subtotal, deliveryFee, serviceFee, total } = computeTotals(payload);
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
    deliveryFee,
    serviceFee,
    total,
    status: "confirmed",
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === "cod" ? "pending" : "paid",
    deliveryAddress: payload.deliveryAddress,
    address: payload.deliveryAddress,
    createdAt: now,
    timeline: [{ status: "confirmed", at: now, note: "Đơn được xác nhận" }],
  };
};

// Demo state-machine: next status after the given one.
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready_for_pickup",
  ready_for_pickup: "finding_driver",
  finding_driver: "driver_assigned",
  driver_assigned: "picking",
  picking: "delivering",
  picking_up: "delivering",
  delivering: "completed",
};

registerMock("POST", "/orders", async (_p, body) => {
  const o = generate(body as CheckoutPayload);
  mockOrders.unshift(o);
  persist();
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
  persist();
  return o;
});

registerMock("POST", "/orders/:id/advance", async (p) => {
  const id = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  const next = NEXT[o.status];
  if (!next) throw new ApiError("Đơn không thể chuyển bước tiếp theo", 400);
  o.status = next;
  o.timeline.push({ status: next, at: new Date().toISOString(), note: "Mô phỏng bước tiếp theo" });
  persist();
  return o;
});

registerMock("POST", "/orders/:id/cancel", async (p, body) => {
  const id = p.split("/")[2];
  const o = mockOrders.find((x) => x.id === id);
  if (!o) throw new ApiError("Không tìm thấy đơn", 404);
  if (o.status === "completed") throw new ApiError("Đơn đã hoàn tất, không thể huỷ", 400);
  if (["delivering", "picking", "picking_up"].includes(o.status))
    throw new ApiError("Đơn đang giao, không thể huỷ", 400);
  o.status = "cancelled";
  o.timeline.push({ status: "cancelled", at: new Date().toISOString(), note: (body as { reason?: string })?.reason });
  persist();
  return o;
});

export const orderService = {
  createOrder: (payload: CheckoutPayload) => apiClient.post<Order>("/orders", payload),
  getCustomerOrders: (customerId: string) => apiClient.get<Order[]>(`/orders/customer/${customerId}`),
  getOrderById: (orderId: string) => apiClient.get<Order>(`/orders/${orderId}`),
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${orderId}/status`, { status }),
  advanceStatus: (orderId: string) => apiClient.post<Order>(`/orders/${orderId}/advance`),
  cancelOrder: (orderId: string, reason?: string) =>
    apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason }),
  getAll: async () => mockOrders,
  // Returns the previous order's items for re-order (same-market rule enforced
  // by cartService at add-time).
  reorder: async (orderId: string) => {
    const o = mockOrders.find((x) => x.id === orderId);
    if (!o) throw new ApiError("Không tìm thấy đơn", 404);
    return { marketId: o.marketId, items: o.items };
  },
};
