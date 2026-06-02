export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "finding_driver"
  | "driver_assigned"
  | "picking"
  | "picking_up"
  | "delivering"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cod" | "momo" | "vnpay" | "card";

export interface OrderItem {
  productId: string;
  stallId: string;
  qty: number;
  note?: string;
  prep?: string;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customer: string;
  customerPhone: string;
  marketId: string;
  stallIds: string[];
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  deliveryAddress: string;
  address: string;
  driverId?: string;
  createdAt: string;
  estimatedArrivalTime?: string;
  timeline: OrderTimelineEntry[];
}

export interface CheckoutPayload {
  marketId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  note?: string;
  voucherCode?: string;
}
