import { useEffect, useState } from "react";
import { getProduct, getStall } from "./mock-data";

export interface CartItem {
  productId: string;
  stallId: string;
  marketId: string;
  qty: number;
  prep?: string;
  note?: string;
  replacement?: string;
}

const KEY = "cnm-cart-v1";

const emit = () => window.dispatchEvent(new Event("cnm-cart"));

export const cart = {
  get(): CartItem[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  },
  set(items: CartItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
    emit();
  },
  add(item: CartItem): { ok: boolean; reason?: string } {
    const items = this.get();
    if (items.length && items[0].marketId !== item.marketId) {
      return { ok: false, reason: "Mỗi đơn hiện chỉ hỗ trợ mua trong cùng một chợ để giao hàng nhanh và giữ độ tươi." };
    }
    const existing = items.find(i => i.productId === item.productId && i.prep === item.prep);
    if (existing) existing.qty += item.qty;
    else items.push(item);
    this.set(items);
    return { ok: true };
  },
  updateQty(productId: string, qty: number) {
    const items = this.get().map(i => i.productId === productId ? { ...i, qty } : i).filter(i => i.qty > 0);
    this.set(items);
  },
  remove(productId: string) {
    this.set(this.get().filter(i => i.productId !== productId));
  },
  clear() { this.set([]); },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(cart.get());
    const h = () => setItems(cart.get());
    window.addEventListener("cnm-cart", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("cnm-cart", h); window.removeEventListener("storage", h); };
  }, []);
  const count = items.reduce((s, i) => s + 1, 0);
  const subtotal = items.reduce((s, i) => {
    const p = getProduct(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const stallGroups = items.reduce<Record<string, CartItem[]>>((acc, i) => {
    (acc[i.stallId] ||= []).push(i); return acc;
  }, {});
  return { items, count, subtotal, stallGroups, marketId: items[0]?.marketId };
}
