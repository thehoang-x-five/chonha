import { useCallback } from "react";
import { deliveryService } from "@/services/deliveryService";
import type { DeliveryStatus } from "@/types/delivery.types";

export function useDelivery() {
  const findAvailable = useCallback((orderId: string) => deliveryService.findAvailableDrivers(orderId), []);
  const accept = useCallback((driverId: string, orderId: string) => deliveryService.acceptTrip(driverId, orderId), []);
  const updatePickup = useCallback(
    (orderId: string, stallId: string, status: "picked" | "missing") =>
      deliveryService.updatePickupStatus(orderId, stallId, status),
    [],
  );
  const updateStatus = useCallback(
    (orderId: string, status: DeliveryStatus) => deliveryService.updateDeliveryStatus(orderId, status),
    [],
  );
  const confirmDelivery = useCallback(
    (orderId: string, otp: string) => deliveryService.confirmDelivery(orderId, otp),
    [],
  );
  return { findAvailable, accept, updatePickup, updateStatus, confirmDelivery };
}
