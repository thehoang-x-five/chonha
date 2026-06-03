import { useEffect, useState, useCallback } from "react";
import { authService, type SavedAddress } from "@/services/authService";
import { STORAGE_KEYS } from "@/lib/storage";

export function useAddresses() {
  const [data, setData] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    authService.listAddresses().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
    const h = () => refetch();
    window.addEventListener(`cnm:${STORAGE_KEYS.addresses}`, h);
    return () => window.removeEventListener(`cnm:${STORAGE_KEYS.addresses}`, h);
  }, [refetch]);

  return {
    data, loading, refetch,
    add: async (a: Omit<SavedAddress, "id">) => { const r = await authService.addAddress(a); refetch(); return r; },
    update: async (id: string, p: Partial<SavedAddress>) => { const r = await authService.updateAddress(id, p); refetch(); return r; },
    remove: async (id: string) => { await authService.deleteAddress(id); refetch(); },
    defaultAddress: data.find((a) => a.isDefault) ?? data[0] ?? null,
  };
}
