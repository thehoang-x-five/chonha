import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/driver/notifications")({ component: Page });

function Page() {
  const { user } = useAuth();
  const { data, loading, markRead } = useNotifications(user?.id);
  return (
    <MobileShell area="driver" nav={<DriverBottomNav />}>
      <AppHeader title="Thông báo" back="/driver/home" />
      {loading ? (
        <LoadingSkeleton />
      ) : data.length === 0 ? (
        <EmptyState icon={<Bell className="h-7 w-7" />} title="Chưa có thông báo" />
      ) : (
        <ul className="space-y-2 p-3">
          {data.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className={`w-full rounded-2xl border bg-card p-3 text-left ${!n.isRead ? "ring-1 ring-primary/40" : ""}`}
              >
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </MobileShell>
  );
}
