import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockProducts } from "@/mocks/mockProducts";
import type { Product } from "@/types/product.types";

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

registerMock("GET", "/products/search/:q", async (p) => {
  const q = decodeURIComponent(p.split("/").pop() ?? "").toLowerCase();
  return mockProducts.filter((x) => x.name.toLowerCase().includes(q));
});

registerMock("PATCH", "/products/:id/availability", async (p, body) => {
  const id = p.split("/")[2];
  const x = mockProducts.find((y) => y.id === id);
  if (!x) throw new ApiError("Không tìm thấy sản phẩm", 404);
  const v = (body as { isAvailable: boolean }).isAvailable;
  x.isAvailable = v;
  x.inStock = v;
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

export const productService = {
  getProductsByStall: (stallId: string) => apiClient.get<Product[]>(`/stalls/${stallId}/products`),
  getProductById: (productId: string) => apiClient.get<Product>(`/products/${productId}`),
  searchProducts: (keyword: string) => apiClient.get<Product[]>(`/products/search/${encodeURIComponent(keyword)}`),
  updateProductAvailability: (productId: string, isAvailable: boolean) =>
    apiClient.patch<Product>(`/products/${productId}/availability`, { isAvailable }),
  updateProductPrice: (productId: string, price: number) =>
    apiClient.patch<Product>(`/products/${productId}/price`, { price }),
};
