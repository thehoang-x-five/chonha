import { useEffect, useState, useCallback } from "react";
import { stallService } from "@/services/stallService";
import type { Stall } from "@/types/stall.types";

export function useStallsByMarket(marketId: string | undefined) {
  const [data, setData] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!marketId) { setLoading(false); return; }
    setLoading(true);
    stallService.getStallsByMarket(marketId)
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [marketId]);

  return { data, loading, error };
}

export function useStall(stallId: string | undefined) {
  const [data, setData] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!stallId) { setLoading(false); return; }
    setLoading(true);
    stallService.getStallById(stallId).then((d) => setData(d)).finally(() => setLoading(false));
  }, [stallId]);

  const toggleFollow = useCallback(async () => {
    if (!data) return;
    const next = data.isFollowed
      ? await stallService.unfollowStall(data.id)
      : await stallService.followStall(data.id);
    setData({ ...next });
  }, [data]);

  return { data, loading, toggleFollow };
}

export function useFollowedStalls() {
  const [data, setData] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = () => {
    setLoading(true);
    stallService.getFollowedStalls().then((d) => setData(d)).finally(() => setLoading(false));
  };
  useEffect(refetch, []);
  return { data, loading, refetch };
}
