import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck, Package, BadgePercent, Bike, Cog } from "lucide-react";

export const Route = createFileRoute("/customer/notifications")({ component: NotificationsPage });

const iconFor = (t: string) => {
  if (t === "order") return <Package className="h-4 w-4" />;
  if (t === "promo") return <BadgePercent className="h-4 w-4" />;
  if (t === "delivery") return <Bike className="h-4 w-4" />;
  return <Cog className="h-4 w-4" />;
};

function NotificationsPage() {
  const { user } = useAuth();
  const { data, loading, markRead, markAllRead, unread } = useNotifications(user?.id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader
        title="Thông báo"
        back="/customer/profile"
        right={
          unread > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary active:bg-muted"
            >
              <CheckCheck className="mr-1 inline h-3.5 w-3.5" /> Đọc tất cả
            </button>
          ) : undefined
        }
      />
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-7 w-7" />}
          title="Chưa có thông báo"
          description="Cập nhật đơn hàng và khuyến mãi sẽ xuất hiện tại đây."
        />
      ) : (
        <ul className="space-y-2 p-3">
          {data.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border bg-card p-3 text-left active:scale-[0.99] ${
                  !n.isRead ? "ring-1 ring-primary/40" : ""
                }`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  {iconFor(n.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Đánh dấu tất cả là đã đọc?"
        confirmLabel="Đồng ý"
        onConfirm={async () => {
          await markAllRead();
          setConfirmOpen(false);
        }}
      />
    </PageShell>
  );
}
