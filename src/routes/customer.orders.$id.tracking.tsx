import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Phone, MessageCircle, RotateCcw, HelpCircle, Check, Clock } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { OrderTimeline } from "@/components/order-timeline";
import { MapPlaceholder } from "@/components/cards";
import { orders, getDriver, getStall, getMarket, getProduct, formatVnd, type Order } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/customer/orders/$id/tracking")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

const flow: Order["status"][] = ["confirmed","preparing","finding_driver","picking","delivering","completed"];

function Page() {
  const initial = Route.useLoaderData();
  const [status, setStatus] = useState<Order["status"]>(initial.status);
  const driver = getDriver(initial.driverId) || getDriver("d1")!;
  const market = getMarket(initial.marketId)!;

  // Auto-progress for demo
  useEffect(() => {
    if (status === "completed" || status === "cancelled") return;
    const t = setTimeout(() => {
      const i = flow.indexOf(status);
      if (i >= 0 && i < flow.length - 1) setStatus(flow[i + 1]);
    }, 4000);
    return () => clearTimeout(t);
  }, [status]);

  const stallIds = Array.from(new Set<string>(initial.items.map((i: any) => i.stallId)));
  const pickedCount = status === "picking" ? 2 : status === "delivering" || status === "completed" ? stallIds.length : 0;

  return (
    <MobileShell>
      <AppHeader title="Theo dõi đơn" back="/customer/orders" subtitle={`#${initial.code}`} />
      <div className="px-4 pt-3">
        <MapPlaceholder className="h-48" label={status === "delivering" ? "Tài xế đang trên đường" : "Đang theo dõi đơn"} />
      </div>

      {/* Driver card */}
      {(status === "picking" || status === "delivering" || status === "completed") && (
        <div className="mx-4 mt-3 rounded-2xl border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl">{driver.avatar}</div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{driver.name} <span className="text-xs text-muted-foreground">· ⭐ {driver.rating}</span></p>
              <p className="text-xs text-muted-foreground">{driver.vehicle} · {driver.plate}</p>
            </div>
            <a href={`tel:${driver.phone}`} className="tap-target grid place-items-center rounded-full bg-primary text-primary-foreground"><Phone className="h-4 w-4" /></a>
            <button className="tap-target grid place-items-center rounded-full border"><MessageCircle className="h-4 w-4" /></button>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-info/15 px-2.5 py-1 text-xs font-medium text-info"><Clock className="h-3 w-3" /> Dự kiến tới: 8 phút nữa</div>
        </div>
      )}

      {/* Timeline */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trạng thái đơn hàng</p>
        <OrderTimeline current={status} />
      </div>

      {/* Pickup checklist */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lấy hàng tại {market.name}</p>
        <ul className="space-y-2">
          {stallIds.map((sid, i) => {
            const s = getStall(sid)!;
            const picked = i < pickedCount;
            return (
              <li key={sid} className="flex items-center gap-3">
                <div className={`grid h-7 w-7 place-items-center rounded-full ${picked ? "bg-success text-success-foreground" : "border bg-muted"}`}>
                  {picked ? <Check className="h-4 w-4" /> : <span className="text-xs">{i+1}</span>}
                </div>
                <span className={`flex-1 text-sm ${picked ? "" : "text-muted-foreground"}`}>{picked ? "Đã lấy hàng tại " : "Đang chờ tại "}{s.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Order */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sản phẩm</p>
        <ul className="mt-2 space-y-1 text-sm">
          {initial.items.map((it: any) => {
            const p = getProduct(it.productId)!;
            return <li key={it.productId} className="flex justify-between"><span>{p.name} × {it.qty}</span><span className="font-medium">{formatVnd(p.price * it.qty)}</span></li>;
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t pt-2">
          <span className="text-sm font-semibold">Tổng cộng</span>
          <span className="text-lg font-extrabold text-primary">{formatVnd(initial.total)}</span>
        </div>
      </div>

      <div className="m-4 grid grid-cols-2 gap-2 pb-8">
        <button className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-3 text-sm font-semibold"><RotateCcw className="h-4 w-4" />Đặt lại</button>
        <button className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-3 text-sm font-semibold"><HelpCircle className="h-4 w-4" />Hỗ trợ</button>
      </div>
    </MobileShell>
  );
}
