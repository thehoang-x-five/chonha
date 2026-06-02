import { useEffect, useState, useCallback } from "react";
import { notificationService } from "@/services/notificationService";
import type { AppNotification } from "@/types/notification.types";

export function useNotifications(userId: string | undefined) {
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    notificationService.listForUser(userId).then(setData).finally(() => setLoading(false));
  }, [userId]);

  useEffect(refresh, [refresh]);

  const markRead = useCallback(async (id: string) => {
    await notificationService.markRead(id);
    refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await notificationService.markAllRead(userId);
    refresh();
  }, [userId, refresh]);

  return { data, loading, refresh, markRead, markAllRead, unread: data.filter((n) => !n.isRead).length };
}
