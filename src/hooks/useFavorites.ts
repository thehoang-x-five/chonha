import { useEffect, useState, useCallback } from "react";
import { stallService } from "@/services/stallService";
import type { Stall } from "@/types/stall.types";
import { STORAGE_KEYS } from "@/lib/storage";

export function useFavorites() {
  const [data, setData] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    stallService.listFollowed().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
    const h = () => refetch();
    window.addEventListener(`cnm:${STORAGE_KEYS.followedStalls}`, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(`cnm:${STORAGE_KEYS.followedStalls}`, h);
      window.removeEventListener("storage", h);
    };
  }, [refetch]);

  const follow = useCallback(async (id: string) => { await stallService.followStall(id); refetch(); }, [refetch]);
  const unfollow = useCallback(async (id: string) => { await stallService.unfollowStall(id); refetch(); }, [refetch]);
  const isFollowed = useCallback((id: string) => stallService.isFollowed(id), []);

  return { data, loading, refetch, follow, unfollow, isFollowed };
}
