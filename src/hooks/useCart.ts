import { useEffect, useState, useCallback } from "react";
import { cartService } from "@/services/cartService";
import type { Cart } from "@/types/cart.types";

const EMPTY: Cart = {
  marketId: null, items: [], subtotal: 0, deliveryFee: 0, serviceFee: 0, discount: 0, total: 0,
};

export function useCart() {
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    cartService.getCart().then(setCart).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("cnm-cart", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("cnm-cart", h);
      window.removeEventListener("storage", h);
    };
  }, [refresh]);

  const addToCart = useCallback(
    (productId: string, qty = 1, prep?: string, note?: string) =>
      cartService.addToCart(productId, qty, prep, note).then((c) => { setCart(c); return c; }),
    [],
  );
  const updateItem = useCallback(
    (productId: string, qty: number) =>
      cartService.updateCartItem(productId, qty).then((c) => { setCart(c); return c; }),
    [],
  );
  const removeItem = useCallback(
    (productId: string) =>
      cartService.removeCartItem(productId).then((c) => { setCart(c); return c; }),
    [],
  );
  const clear = useCallback(
    () => cartService.clearCart().then((c) => { setCart(c); return c; }),
    [],
  );

  return { cart, loading, count: cart.items.length, addToCart, updateItem, removeItem, clear, refresh };
}
