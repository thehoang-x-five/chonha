import { useEffect, useState, useCallback } from "react";
import { voucherService } from "@/services/voucherService";
import type { Voucher } from "@/types/voucher.types";

export function useVouchers() {
  const [data, setData] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    voucherService.list().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    data,
    loading,
    refresh,
    available: data.filter((v) => v.status === "available"),
    used: data.filter((v) => v.status === "used"),
    expired: data.filter((v) => v.status === "expired"),
  };
}
