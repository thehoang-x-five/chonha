import { useEffect, useState } from "react";
import { marketService } from "@/services/marketService";
import type { Market } from "@/types/market.types";

export function useMarkets() {
  const [data, setData] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    setLoading(true);
    marketService.getMarkets()
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(refetch, []);
  return { data, loading, error, refetch };
}

export function useMarket(marketId: string | undefined) {
  const [data, setData] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!marketId) { setLoading(false); return; }
    setLoading(true);
    marketService.getMarketById(marketId)
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [marketId]);

  return { data, loading, error };
}
