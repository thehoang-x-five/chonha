import type { StallCategory } from "./stall.types";

export interface Product {
  id: string;
  stallId: string;
  marketId: string;
  name: string;
  category: StallCategory;
  price: number;
  unit: string;
  imageUrl?: string;
  image: string;
  freshnessNote?: string;
  isAvailable: boolean;
  preparationOptions: string[];
}
