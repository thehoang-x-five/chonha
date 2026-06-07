export type VoucherStatus = "available" | "used" | "expired";
export type VoucherType = "shipping" | "discount" | "cashback";

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: VoucherType;
  /** Discount value: percent (0–100) or fixed VND. */
  value: number;
  /** "percent" or "fixed". */
  unit: "percent" | "fixed";
  minOrder?: number;
  expiresAt: string;
  status: VoucherStatus;
  scope?: "all" | "market" | "stall";
}
