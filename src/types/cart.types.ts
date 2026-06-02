export interface CartItem {
  id: string;
  productId: string;
  stallId: string;
  marketId: string;
  qty: number;
  prep?: string;
  note?: string;
  replacement?: string;
}

export interface Cart {
  marketId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
}
