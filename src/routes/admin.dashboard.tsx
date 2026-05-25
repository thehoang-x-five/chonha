import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { KPIStatCard } from "@/components/cards";
import { formatVnd, markets, orders, drivers } from "@/lib/mock-data";
import { TrendingUp, Package, Store, Users, Truck, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: Page });

const dayData = [120, 180, 160, 210, 250, 290, 240];
const dayLabels = ["T2","T3","T4","T5","T6","T7","CN"];

function Page() {
  const max = Math.max(...dayData);
  return (
    <AdminShell title="Tổng quan">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KPIStatCard label="Đơn hôm nay" value="248" accent="primary" hint="+18%" />
        <KPIStatCard label="Doanh thu" value={formatVnd(54200000)} accent="success" />
        <KPIStatCard label="Gian hàng hoạt động" value="42" accent="info" />
        <KPIStatCard label="Tài xế online" value="12" accent="warning" />
        <KPIStatCard label="Đơn đang giao" value="18" accent="info" />
        <KPIStatCard label="Đơn có sự cố" value="2" accent="primary" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-bold">Đơn theo ngày</h3>
          <div className="mt-4 flex h-48 items-end gap-3">
            {dayData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/50" style={{ height: `${(v / max) * 100}%` }} />
                </div>
                <span className="text-xs font-semibold">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-bold">Doanh thu theo chợ</h3>
          <ul className="mt-3 space-y-3">
            {markets.map((m, i) => {
              const pct = [70, 50, 40][i];
              return (
                <li key={m.id}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{m.name}</span><span className="text-muted-foreground">{formatVnd(15000000 - i * 3500000)}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-bold">Danh mục bán chạy</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[{e:"🐟",l:"Hải sản",v:"35%"},{e:"🥬",l:"Rau củ",v:"24%"},{e:"🥩",l:"Thịt",v:"18%"},{e:"🍎",l:"Trái cây",v:"14%"},{e:"🌶️",l:"Gia vị",v:"6%"},{e:"🍚",l:"Đồ khô",v:"3%"}].map(c => (
              <div key={c.l} className="rounded-xl bg-muted/50 p-3"><div className="text-2xl">{c.e}</div><p className="mt-1 text-sm font-bold">{c.v}</p><p className="text-xs text-muted-foreground">{c.l}</p></div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-bold">Trạng thái giao hàng</h3>
          <ul className="mt-3 space-y-2">
            {[{l:"Đang chuẩn bị",v:24,c:"bg-warning"},{l:"Đang giao",v:18,c:"bg-info"},{l:"Hoàn tất",v:198,c:"bg-success"},{l:"Sự cố",v:2,c:"bg-destructive"}].map(s => (
              <li key={s.l} className="flex items-center gap-3 text-sm"><span className={`h-3 w-3 rounded-full ${s.c}`} /><span className="flex-1">{s.l}</span><span className="font-bold">{s.v}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
