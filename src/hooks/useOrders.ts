import { useEffect, useState, useCallback } from "react";
import { orderService } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order.types";

export function useCustomerOrders(customerId: string | undefined) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(() => {
    if (!customerId) { setLoading(false); return; }
    setLoading(true);
    orderService.getCustomerOrders(customerId).then(setData).finally(() => setLoading(false));
  }, [customerId]);
  useEffect(refetch, [refetch]);
  return { data, loading, refetch };
}

export function useOrder(orderId: string | undefined) {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(() => {
    if (!orderId) { setLoading(false); return; }
    setLoading(true);
    orderService.getOrderById(orderId).then(setData).finally(() => setLoading(false));
  }, [orderId]);
  useEffect(refetch, [refetch]);

  const updateStatus = useCallback(
    (status: OrderStatus) =>
      orderId ? orderService.updateOrderStatus(orderId, status).then((o) => { setData(o); return o; }) : Promise.reject(),
    [orderId],
  );
  const cancel = useCallback(
    (reason: string) =>
      orderId ? orderService.cancelOrder(orderId, reason).then((o) => { setData(o); return o; }) : Promise.reject(),
    [orderId],
  );

  return { data, loading, refetch, updateStatus, cancel };
}
