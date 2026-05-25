import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { MapPlaceholder } from "@/components/cards";
import { drivers, orders, getMarket, formatVnd } from "@/lib/mock-data";
import { Star, Bike } from "lucide-react";

export const Route = createFileRoute("/admin/dispatch")({ component: Page });

function Page() {
  const waiting = orders.filter(o => o.status === "finding_driver" || o.status === "confirmed");
  const available = drivers.filter(d => d.online);
  return (
    <AdminShell title="Điều phối giao hàng">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><MapPlaceholder className="h-64 lg:h-full" label="Bản đồ điều phối Quận 7" /></div>
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="font-bold">Cách hệ thống chấm điểm</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex justify-between rounded-xl bg-muted/50 p-2.5"><span>Khoảng cách đến chợ</span><span className="font-bold">40%</span></li>
            <li className="flex justify-between rounded-xl bg-muted/50 p-2.5"><span>Cuốc đang xử lý</span><span className="font-bold">25%</span></li>
            <li className="flex justify-between rounded-xl bg-muted/50 p-2.5"><span>Đánh giá tài xế</span><span className="font-bold">20%</span></li>
            <li className="flex justify-between rounded-xl bg-muted/50 p-2.5"><span>Phương tiện phù hợp</span><span className="font-bold">15%</span></li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">* Mô phỏng frontend, chưa kết nối thuật toán thực.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="font-bold">Đơn đang chờ tài xế</h3>
          <ul className="mt-3 space-y-2">
            {waiting.map(o => {
              const m = getMarket(o.marketId)!;
              return (
                <li key={o.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div><p className="font-semibold">#{o.code}</p><p className="text-xs text-muted-foreground">{m.name} → {o.address}</p></div>
                  <span className="text-sm font-bold text-primary">{formatVnd(o.total)}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="font-bold">Tài xế khả dụng gần đây</h3>
          <ul className="mt-3 space-y-2">
            {available.map(d => {
              const score = 70 + (d.rating - 4.5) * 20;
              return (
                <li key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xl">{d.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating} · <Bike className="h-3 w-3" /> {d.vehicle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary">{Math.round(score)}</p>
                    <p className="text-xs text-muted-foreground">điểm match</p>
                  </div>
                  <button className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Gán</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
