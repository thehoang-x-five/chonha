import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { orders, getMarket, formatVnd, type Order } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";

export const Route = createFileRoute("/customer/orders")({ component: Page });

const tabs = [
  { id: "active", label: "Đang giao", match: (o: Order) => !["completed","cancelled"].includes(o.status) },
  { id: "done", label: "Đã hoàn tất", match: (o: Order) => o.status === "completed" },
  { id: "cancel", label: "Đã hủy", match: (o: Order) => o.status === "cancelled" },
] as const;

function Page() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("active");
  const list = orders.filter(tabs.find(t => t.id === tab)!.match);
  return (
    <MobileShell nav={<CustomerBottomNav />}>
      <AppHeader title="Đơn hàng của tôi" />
      <div className="sticky top-14 z-20 flex gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 rounded-full border py-2 text-xs font-semibold ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t.label}</button>
        ))}
      </div>
      <div className="space-y-3 px-4 pt-3">
        {list.map(o => {
          const m = getMarket(o.marketId)!;
          const meta = orderStatusLabel[o.status];
          return (
            <Link key={o.id} to="/customer/orders/$id/tracking" params={{ id: o.id }} className="block rounded-2xl border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">#{o.code}</p>
                <StatusBadge variant={meta.variant}>{meta.label}</StatusBadge>
              </div>
              <p className="mt-1 font-semibold">{m.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("vi-VN")}</p>
              <div className="mt-2 flex items-center justify-between border-t pt-2">
                <span className="text-sm font-bold text-primary">{formatVnd(o.total)}</span>
                <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">Đặt lại</button>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có đơn nào</p>}
      </div>
    </MobileShell>
  );
}
