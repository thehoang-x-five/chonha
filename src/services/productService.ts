import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockProducts } from "@/mocks/mockProducts";
import { mockStalls } from "@/mocks/mockStalls";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Product } from "@/types/product.types";
import type { StallCategory } from "@/types/stall.types";

// Hydrate vendor-side availability overrides.
(() => {
  if (typeof window === "undefined") return;
  const overrides = loadJSON<Record<string, boolean>>(STORAGE_KEYS.vendorAvailability, {});
  Object.entries(overrides).forEach(([id, v]) => {
    const p = mockProducts.find((x) => x.id === id);
    if (p) {
      p.isAvailable = v;
      (p as Product & { inStock?: boolean }).inStock = v;
    }
  });
})();

const persistAvailability = (id: string, v: boolean) => {
  const cur = loadJSON<Record<string, boolean>>(STORAGE_KEYS.vendorAvailability, {});
  cur[id] = v;
  saveJSON(STORAGE_KEYS.vendorAvailability, cur);
};

registerMock("GET", "/stalls/:id/products", async (p) => {
  const stallId = p.split("/")[2];
  return mockProducts.filter((x) => x.stallId === stallId);
});

registerMock("GET", "/products/:id", async (p) => {
  const id = p.split("/").pop();
  const x = mockProducts.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy sản phẩm", 404);
  return x;
});

registerMock("GET", "/products", async () => mockProducts);

registerMock("GET", "/products/search/:q", async (p) => {
  const q = decodeURIComponent(p.split("/").pop() ?? "").toLowerCase();
  if (!q) return mockProducts;
  return mockProducts.filter((x) => x.name.toLowerCase().includes(q));
});

registerMock("PATCH", "/products/:id/availability", async (p, body) => {
  const id = p.split("/")[2];
  const x = mockProducts.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy sản phẩm", 404);
  const v = (body as { isAvailable: boolean }).isAvailable;
  x.isAvailable = v;
  (x as Product & { inStock?: boolean }).inStock = v;
  persistAvailability(id, v);
  return x;
});

registerMock("PATCH", "/products/:id/price", async (p, body) => {
  const id = p.split("/")[2];
  const x = mockProducts.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy sản phẩm", 404);
  const price = (body as { price: number }).price;
  if (price <= 0) throw new ApiError("Giá phải lớn hơn 0", 400);
  x.price = price;
  return x;
});

registerMock("POST", "/products", async (_p, body) => {
  const b = body as Partial<Product> & { stallId: string };
  const stall = mockStalls.find((s) => s.id === b.stallId);
  if (!stall) throw new ApiError("Không tìm thấy sạp", 404);
  const product: Product = {
    id: `p-${Date.now()}`,
    stallId: b.stallId,
    marketId: stall.marketId,
    name: b.name ?? "Sản phẩm mới",
    category: (b.category as StallCategory) ?? stall.category,
    price: b.price ?? 0,
    unit: b.unit ?? "kg",
    image: b.image ?? "🧺",
    isAvailable: b.isAvailable ?? true,
    preparationOptions: b.preparationOptions ?? [],
  };
  (mockProducts as Product[]).unshift(product);
  return product;
});

registerMock("PATCH", "/products/:id", async (p, body) => {
  const id = p.split("/")[2];
  const x = mockProducts.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy sản phẩm", 404);
  Object.assign(x, body);
  return x;
});

registerMock("DELETE", "/products/:id", async (p) => {
  const id = p.split("/")[2];
  const idx = mockProducts.findIndex((y) => y.id === id);
  if (idx < 0) throw new ApiError("Không tìm thấy sản phẩm", 404);
  mockProducts.splice(idx, 1);
  return { ok: true };
});

export const productService = {
  getProductsByStall: (stallId: string) => apiClient.get<Product[]>(`/stalls/${stallId}/products`),
  getProductById: (productId: string) => apiClient.get<Product>(`/products/${productId}`),
  getAllProducts: () => apiClient.get<Product[]>("/products"),
  searchProducts: (keyword: string) =>
    apiClient.get<Product[]>(`/products/search/${encodeURIComponent(keyword || "_")}`),
  updateProductAvailability: (productId: string, isAvailable: boolean) =>
    apiClient.patch<Product>(`/products/${productId}/availability`, { isAvailable }),
  toggleAvailability: (productId: string, isAvailable: boolean) =>
    apiClient.patch<Product>(`/products/${productId}/availability`, { isAvailable }),
  updateProductPrice: (productId: string, price: number) =>
    apiClient.patch<Product>(`/products/${productId}/price`, { price }),
  updatePrice: (productId: string, price: number) =>
    apiClient.patch<Product>(`/products/${productId}/price`, { price }),
  createProduct: (input: Partial<Product> & { stallId: string }) =>
    apiClient.post<Product>("/products", input),
  updateProduct: (productId: string, patch: Partial<Product>) =>
    apiClient.patch<Product>(`/products/${productId}`, patch),
  deleteProduct: (productId: string) => apiClient.delete<{ ok: true }>(`/products/${productId}`),
};
