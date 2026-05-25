import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { orders, getProduct, formatVnd } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/vendor/orders")({ component: Page });

function Page() {
  // pretend stall s1
  const list = orders.filter(o => o.items.some(i => i.stallId === "s1"));
  return (
    <MobileShell nav={<VendorBottomNav />}>
      <AppHeader title="Đơn hàng" />
      <div className="space-y-3 px-4 pt-3">
        {list.map(o => {
          const meta = orderStatusLabel[o.status];
          const myItems = o.items.filter(i => i.stallId === "s1");
          return (
            <div key={o.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">#{o.code} · {new Date(o.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <StatusBadge variant={meta.variant}>{meta.label}</StatusBadge>
              </div>
              <ul className="mt-3 space-y-1 rounded-xl bg-muted/50 p-3 text-sm">
                {myItems.map(i => {
                  const p = getProduct(i.productId)!;
                  return <li key={i.productId}><span className="font-semibold">{i.qty} {p.unit}</span> · {p.name}</li>;
                })}
              </ul>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Link to="/vendor/orders/$id" params={{ id: o.id }} className="rounded-2xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground">Nhận đơn</Link>
                <button className="rounded-2xl border bg-card py-3 text-sm font-bold">Từ chối</button>
                <a href={`tel:${o.customerPhone}`} className="grid place-items-center rounded-2xl border bg-card py-3 text-sm font-bold"><Phone className="h-4 w-4" /></a>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
