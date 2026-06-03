import { apiClient, registerMock, ApiError } from "./apiClient";
import { mockStalls } from "@/mocks/mockStalls";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Stall } from "@/types/stall.types";

// Hydrate persisted favorites (list of stall IDs the user is following).
const readFollowed = (): string[] => loadJSON<string[]>(STORAGE_KEYS.followedStalls, []);
const writeFollowed = (ids: string[]) => saveJSON(STORAGE_KEYS.followedStalls, ids);

// Apply persisted follow state to the in-memory mock array on first load.
(() => {
  if (typeof window === "undefined") return;
  const followed = new Set(readFollowed());
  if (followed.size === 0) {
    // Seed with whatever was already true in mock data.
    const seeded = mockStalls.filter((s) => s.isFollowed).map((s) => s.id);
    if (seeded.length) writeFollowed(seeded);
    return;
  }
  mockStalls.forEach((s) => (s.isFollowed = followed.has(s.id)));
})();

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
  const ids = readFollowed();
  if (!ids.includes(id)) writeFollowed([...ids, id]);
  return s;
});

registerMock("POST", "/stalls/:id/unfollow", async (p) => {
  const id = p.split("/")[2];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.isFollowed = false;
  writeFollowed(readFollowed().filter((x) => x !== id));
  return s;
});

registerMock("PATCH", "/stalls/:id/open", async (p, body) => {
  const id = p.split("/")[2];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  const open = (body as { isOpen: boolean }).isOpen;
  s.isOpen = open;
  (s as Stall & { open?: boolean }).open = open;
  return s;
});

registerMock("PATCH", "/stalls/:id", async (p, body) => {
  const id = p.split("/")[2];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  Object.assign(s, body);
  return s;
});

registerMock("POST", "/admin/stalls/:id/suspend", async (p) => {
  const id = p.split("/")[3];
  const s = mockStalls.find((x) => x.id === id);
  if (!s) throw new ApiError("Không tìm thấy sạp", 404);
  s.isOpen = false;
  (s as Stall & { open?: boolean }).open = false;
  s.approvalStatus = "rejected";
  return s;
});

export const stallService = {
  getStallsByMarket: (marketId: string) => apiClient.get<Stall[]>(`/markets/${marketId}/stalls`),
  getStallById: (stallId: string) => apiClient.get<Stall>(`/stalls/${stallId}`),
  followStall: (stallId: string) => apiClient.post<Stall>(`/stalls/${stallId}/follow`),
  unfollowStall: (stallId: string) => apiClient.post<Stall>(`/stalls/${stallId}/unfollow`),
  isFollowed: (stallId: string) => readFollowed().includes(stallId),
  listFollowed: async () => {
    const ids = new Set(readFollowed());
    return mockStalls.filter((s) => ids.has(s.id));
  },
  getFollowedStalls: async () => {
    const ids = new Set(readFollowed());
    return mockStalls.filter((s) => ids.has(s.id));
  },
  setStallOpen: (stallId: string, isOpen: boolean) =>
    apiClient.patch<Stall>(`/stalls/${stallId}/open`, { isOpen }),
  updateStall: (stallId: string, patch: Partial<Stall>) =>
    apiClient.patch<Stall>(`/stalls/${stallId}`, patch),
  suspendStall: (stallId: string) => apiClient.post<Stall>(`/admin/stalls/${stallId}/suspend`),
};
