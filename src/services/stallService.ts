import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockStalls } from "@/mocks/mockStalls";
import type { Stall } from "@/types/stall.types";

registerMock("GET", "/markets/:id/stalls", async (p) => {
  const marketId = p.split("/")[2];
  return mockStalls.filter((s) => s.marketId === marketId);
});

registerMock("GET", "/stalls/:id", async (p) => {
  const id = p.split("/").pop();
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  return s;
});

registerMock("POST", "/stalls/:id/follow", async (p) => {
  const id = p.split("/")[2];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.isFollowed = true;
  return s;
});

registerMock("POST", "/stalls/:id/unfollow", async (p) => {
  const id = p.split("/")[2];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.isFollowed = false;
  return s;
});

export const stallService = {
  getStallsByMarket: (marketId: string) => apiClient.get<Stall[]>(`/markets/${marketId}/stalls`),
  getStallById: (stallId: string) => apiClient.get<Stall>(`/stalls/${stallId}`),
  followStall: (stallId: string) => apiClient.post<Stall>(`/stalls/${stallId}/follow`),
  unfollowStall: (stallId: string) => apiClient.post<Stall>(`/stalls/${stallId}/unfollow`),
  getFollowedStalls: async () => mockStalls.filter((s) => s.isFollowed),
};
