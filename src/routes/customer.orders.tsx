import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBasket, ChevronRight } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/cards";
import { orders, getMarket, getProduct, formatVnd, type Order } from "@/lib/mock-data";
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
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 rounded-full border py-2 text-xs font-semibold transition ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t.label}</button>
        ))}
      </div>
      <div className="space-y-3 px-4 pt-3">
        {list.map(o => {
          const m = getMarket(o.marketId)!;
          const meta = orderStatusLabel[o.status];
          const preview = o.items.slice(0, 3).map(i => getProduct(i.productId)?.image).join(" ");
          return (
            <Link key={o.id} to="/customer/orders/$id/tracking" params={{ id: o.id }} className="block rounded-2xl border bg-card p-3 shadow-sm transition active:scale-[0.99]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-muted-foreground">#{o.code}</p>
                <StatusBadge variant={meta.variant}>{meta.label}</StatusBadge>
              </div>
              <div className="mt-1 flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-muted text-2xl">{preview || "🧺"}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{o.items.length} món · {new Date(o.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t pt-2">
                <span className="text-sm font-extrabold text-primary">{formatVnd(o.total)}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {o.status === "completed" ? "Đặt lại" : "Theo dõi"} <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && (
          <EmptyState
            emoji={tab === "active" ? "🛒" : tab === "done" ? "✅" : "🚫"}
            title={tab === "active" ? "Chưa có đơn đang giao" : tab === "done" ? "Chưa có đơn đã hoàn tất" : "Không có đơn đã huỷ"}
            description={tab === "active" ? "Đặt một đơn để theo dõi tài xế và sạp lấy hàng theo thời gian thực." : undefined}
            action={tab === "active" ? <Link to="/customer/home" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Đi chợ ngay</Link> : undefined}
          />
        )}
      </div>
    </MobileShell>
  );
}
