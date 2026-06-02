import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockPayments } from "@/mocks/mockPayments";
import type { Payment } from "@/types/payment.types";
import type { PaymentMethod } from "@/types/order.types";

registerMock("POST", "/payments", async (_p, body) => {
  const { orderId, method, amount } = body as { orderId: string; method: PaymentMethod; amount: number };
  const pay: Payment = {
    id: `pay-${Date.now()}`,
    orderId,
    method,
    amount,
    status: method === "cod" ? "pending" : "paid",
    createdAt: new Date().toISOString(),
  };
  mockPayments.unshift(pay);
  return pay;
});

registerMock("GET", "/payments/:id", async (p) => {
  const id = p.split("/").pop();
  const x = mockPayments.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy giao dịch", 404);
  return x;
});

registerMock("POST", "/payments/:id/refund", async (p) => {
  const id = p.split("/")[2];
  const x = mockPayments.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy giao dịch", 404);
  x.status = "refunded";
  return x;
});

export const paymentService = {
  createMockPayment: (orderId: string, method: PaymentMethod, amount = 0) =>
    apiClient.post<Payment>("/payments", { orderId, method, amount }),
  getPaymentStatus: (paymentId: string) => apiClient.get<Payment>(`/payments/${paymentId}`),
  refundMockPayment: (paymentId: string) => apiClient.post<Payment>(`/payments/${paymentId}/refund`),
};
