import { useEffect, useState, useCallback } from "react";
import { adminService, type AppSettings, DEFAULT_SETTINGS } from "@/services/adminService";
import { STORAGE_KEYS } from "@/lib/storage";

export function useAppSettings() {
  const [data, setData] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    adminService.getSettings().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
    const h = () => refetch();
    window.addEventListener(`cnm:${STORAGE_KEYS.appSettings}`, h);
    return () => window.removeEventListener(`cnm:${STORAGE_KEYS.appSettings}`, h);
  }, [refetch]);

  const save = useCallback(async (patch: Partial<AppSettings>) => {
    const next = await adminService.saveSettings(patch);
    setData(next);
    return next;
  }, []);

  return { data, loading, save, refetch };
}
