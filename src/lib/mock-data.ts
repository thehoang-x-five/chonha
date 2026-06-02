// COMPATIBILITY SHIM (part of the mocks layer).
// New code should import from `@/services/*` via hooks. Existing route files
// continue to read from here until they are migrated; this file only
// re-exports data from `src/mocks/*` and helpers, so the architectural rule
// "UI never reads raw seed data" still holds at the module boundary.

import { mockMarkets } from "@/mocks/mockMarkets";
import { mockStalls } from "@/mocks/mockStalls";
import { mockProducts } from "@/mocks/mockProducts";
import { mockOrders } from "@/mocks/mockOrders";
import { mockDrivers } from "@/mocks/mockDrivers";
import { seedCategories } from "@/mocks/_seed";

export type { Market } from "@/types/market.types";
export type { Stall } from "@/types/stall.types";
export type { Product } from "@/types/product.types";
export type { Order } from "@/types/order.types";
export type { Driver } from "@/types/delivery.types";
export type { StallCategory as Category } from "@/types/stall.types";

export const markets = mockMarkets;
export const stalls = mockStalls;
export const products = mockProducts;
export const orders = mockOrders;
export const drivers = mockDrivers;
export const categories = seedCategories;

export const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")} đ`;

export const getStall = (id: string) => stalls.find((s) => s.id === id);
export const getMarket = (id: string) => markets.find((m) => m.id === id);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getDriver = (id?: string) => drivers.find((d) => d.id === id);
export const getProductsByStall = (stallId: string) => products.filter((p) => p.stallId === stallId);
export const getStallsByMarket = (marketId: string) => stalls.filter((s) => s.marketId === marketId);
