import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { MapPlaceholder } from "@/components/cards";
import { orders, getStall, getMarket } from "@/lib/mock-data";
import { Phone, Check, AlertTriangle, Navigation } from "lucide-react";

export const Route = createFileRoute("/driver/trips/$id")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

function Page() {
  const order = Route.useLoaderData();
  const market = getMarket(order.marketId)!;
  const stallIds = Array.from(new Set<string>(order.items.map((i: any) => i.stallId)));
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const allPicked = stallIds.every(id => picked[id]);

  return (
    <MobileShell>
      <AppHeader title={`Cuốc #${order.code}`} back="/driver/trips" />
      <div className="px-4 pt-3">
        <MapPlaceholder className="h-44" label="Đang dẫn đường tới chợ" />
      </div>

      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tiến trình</p>
        <ol className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <li className="rounded-xl bg-success/15 p-2 text-center font-semibold text-success">1. Đi đến chợ</li>
          <li className={`rounded-xl p-2 text-center font-semibold ${allPicked ? "bg-success/15 text-success" : "bg-warning/30 text-foreground"}`}>2. Lấy hàng</li>
          <li className={`rounded-xl p-2 text-center font-semibold ${allPicked ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"}`}>3. Giao khách</li>
        </ol>
      </div>

      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="font-bold">Lấy hàng tại {market.name}</p>
        <ul className="mt-2 space-y-2">
          {stallIds.map((sid, idx) => {
            const s = getStall(sid)!;
            const done = picked[sid];
            return (
              <li key={sid} className="rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.cover}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.specialty}</p>
                  </div>
                  <a href="tel:0900000" className="tap-target grid place-items-center rounded-full border"><Phone className="h-4 w-4" /></a>
                </div>
                <button onClick={() => setPicked(p => ({ ...p, [sid]: !p[sid] }))} className={`mt-2 h-12 w-full rounded-xl text-sm font-bold ${done ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}`}>
                  {done ? <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> Đã lấy</span> : "Xác nhận đã lấy hàng"}
                </button>
              </li>
            );
          })}
        </ul>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-2.5 text-sm font-semibold text-destructive">
          <AlertTriangle className="h-4 w-4" /> Báo sự cố
        </button>
      </div>

      <div className="m-4 pb-6">
        {allPicked ? (
          <Link to="/driver/trips/$id" params={{ id: order.id }} search={{ deliver: true } as any} className="block rounded-2xl bg-info py-4 text-center text-base font-bold text-info-foreground">
            <Navigation className="mr-1 inline h-5 w-5" /> Bắt đầu giao cho khách
          </Link>
        ) : (
          <button disabled className="h-14 w-full rounded-2xl bg-muted text-base font-bold text-muted-foreground">Hoàn tất lấy hàng ở tất cả sạp</button>
        )}
      </div>

      {allPicked && <DeliverPanel order={order} />}
    </MobileShell>
  );
}

function DeliverPanel({ order }: { order: any }) {
  const [otp, setOtp] = useState("");
  return (
    <div className="mx-4 my-4 space-y-3 rounded-2xl border-2 border-info bg-info/5 p-4">
      <p className="font-bold text-info">Giao đến khách hàng</p>
      <div>
        <p className="text-sm font-semibold">{order.customer}</p>
        <p className="text-xs text-muted-foreground">{order.address}</p>
        <p className="mt-1 text-xs">SĐT: {order.customerPhone}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a href={`tel:${order.customerPhone}`} className="rounded-2xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground">Gọi khách</a>
        <button className="rounded-2xl border bg-card py-3 text-sm font-bold">Nhắn tin</button>
      </div>
      <div>
        <p className="text-xs font-semibold">Mã OTP xác nhận giao</p>
        <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Nhập mã 4 số" inputMode="numeric" className="mt-1 h-12 w-full rounded-2xl border bg-card px-4 text-base outline-none" />
      </div>
      <button className="h-14 w-full rounded-2xl bg-success text-base font-bold text-success-foreground">Đã giao hàng</button>
    </div>
  );
}
