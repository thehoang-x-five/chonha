export type MarketStatus = "open" | "closing" | "closed";

export interface Market {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  openingHours: string;
  status: MarketStatus;
  rating: number;
  deliveryFeeFrom: number;
  imageUrl?: string;
  cover: string;
  stallCount: number;
}
