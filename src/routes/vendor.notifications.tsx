import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/vendor/notifications")({ component: Page });

function Page() {
  const { user } = useAuth();
  const { data, loading, markRead } = useNotifications(user?.id);
  return (
    <MobileShell area="vendor" nav={<VendorBottomNav />}>
      <AppHeader title="Thông báo" back="/vendor/dashboard" />
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : data.length === 0 ? (
        <EmptyState icon={<Bell className="h-7 w-7" />} title="Chưa có thông báo" />
      ) : (
        <ul className="space-y-2 p-3">
          {data.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className={`w-full rounded-2xl border bg-card p-4 text-left ${!n.isRead ? "ring-2 ring-primary/40" : ""}`}
              >
                <p className="text-base font-bold">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </MobileShell>
  );
}
