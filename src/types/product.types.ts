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
  /** @deprecated legacy alias for `isAvailable` */
  inStock?: boolean;
  /** @deprecated legacy alias for `freshnessNote` */
  freshNote?: string;
  /** @deprecated legacy alias for `preparationOptions` */
  prepOptions?: string[];
}
