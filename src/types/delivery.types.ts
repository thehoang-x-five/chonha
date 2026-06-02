export type DriverVerificationStatus = "pending" | "verified" | "suspended";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehiclePlate: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
  area: string;
  avatar: string;
  isOnline: boolean;
  online: boolean;
  activeOrderId?: string;
  verificationStatus?: DriverVerificationStatus;
  currentLocation?: { lat: number; lng: number };
}

export type PickupItemStatus = "pending" | "picked" | "missing";

export interface PickupChecklistItem {
  stallId: string;
  status: PickupItemStatus;
}

export type DeliveryStatus =
  | "assigned"
  | "to_market"
  | "picking"
  | "to_customer"
  | "delivered"
  | "failed";

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  pickupChecklist: PickupChecklistItem[];
  status: DeliveryStatus;
  estimatedArrivalTime?: string;
}
