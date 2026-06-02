import { ApiError } from "./apiClient";
import { mockProducts } from "@/mocks/mockProducts";
import type { Cart, CartItem } from "@/types/cart.types";

const KEY = "cnm-cart-v1";

const read = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cnm-cart"));
};

const SERVICE_FEE = 5000;

const compute = (items: CartItem[]): Cart => {
  const marketId = items[0]?.marketId ?? null;
  const subtotal = items.reduce((sum, i) => {
    const p = mockProducts.find((x) => x.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
  const deliveryFee = items.length ? 18000 : 0;
  const serviceFee = items.length ? SERVICE_FEE : 0;
  const discount = 0;
  return {
    marketId,
    items,
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    total: subtotal + deliveryFee + serviceFee - discount,
  };
};

const tick = () => new Promise<void>((r) => setTimeout(r, 50));

export const cartService = {
  async getCart(): Promise<Cart> {
    await tick();
    return compute(read());
  },
  async addToCart(productId: string, quantity = 1, prep?: string, note?: string): Promise<Cart> {
    await tick();
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) throw new ApiError("Không tìm thấy sản phẩm", 404);
    if (!product.isAvailable) throw new ApiError("Sản phẩm đã hết hàng", 400);
    const items = read();
    if (items.length && items[0].marketId !== product.marketId) {
      throw new ApiError(
        "Mỗi đơn hiện chỉ hỗ trợ mua trong cùng một chợ để giao hàng nhanh và giữ độ tươi.",
        400,
        "DIFFERENT_MARKET",
      );
    }
    const existing = items.find((i) => i.productId === productId && i.prep === prep);
    if (existing) existing.qty += quantity;
    else items.push({
      id: `ci-${productId}-${Date.now()}`,
      productId,
      stallId: product.stallId,
      marketId: product.marketId,
      qty: quantity,
      prep,
      note,
    });
    write(items);
    return compute(items);
  },
  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    await tick();
    const items = read()
      .map((i) => (i.productId === productId ? { ...i, qty: quantity } : i))
      .filter((i) => i.qty > 0);
    write(items);
    return compute(items);
  },
  async removeCartItem(productId: string): Promise<Cart> {
    await tick();
    write(read().filter((i) => i.productId !== productId));
    return compute(read());
  },
  async clearCart(): Promise<Cart> {
    await tick();
    write([]);
    return compute([]);
  },
  validateSameMarketRule(items: CartItem[], marketId: string): boolean {
    return items.every((i) => i.marketId === marketId);
  },
};
