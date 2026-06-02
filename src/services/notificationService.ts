import { mockNotifications } from "@/mocks/mockNotifications";
import type { AppNotification } from "@/types/notification.types";

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));

export const notificationService = {
  async listForUser(userId: string): Promise<AppNotification[]> {
    await wait();
    return mockNotifications.filter((n) => n.userId === userId);
  },
  async markRead(notificationId: string): Promise<void> {
    await wait();
    const n = mockNotifications.find((x) => x.id === notificationId);
    if (n) n.isRead = true;
  },
  async markAllRead(userId: string): Promise<void> {
    await wait();
    mockNotifications.filter((n) => n.userId === userId).forEach((n) => (n.isRead = true));
  },
};
