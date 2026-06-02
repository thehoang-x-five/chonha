import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockMarkets } from "@/mocks/mockMarkets";
import type { Market } from "@/types/market.types";

registerMock("GET", "/markets", async () => mockMarkets);
registerMock("GET", "/markets/:id", async (_p, _b) => {
  const id = _p.split("/").pop();
  const m = mockMarkets.find((x) => x.id === id);
  if (!m) throw new ApiError("Không tìm thấy chợ", 404);
  return m;
});
registerMock("GET", "/markets/search/:q", async (_p) => {
  const q = decodeURIComponent(_p.split("/").pop() ?? "").toLowerCase();
  return mockMarkets.filter((m) => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q));
});

export const marketService = {
  getMarkets: () => apiClient.get<Market[]>("/markets"),
  getMarketById: (marketId: string) => apiClient.get<Market>(`/markets/${marketId}`),
  searchMarkets: (keyword: string) => apiClient.get<Market[]>(`/markets/search/${encodeURIComponent(keyword)}`),
};
