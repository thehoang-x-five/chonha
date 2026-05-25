import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { KPIStatCard } from "@/components/cards";
import { formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/vendor/revenue")({ component: Page });

const days = [
  { d: "T2", v: 1100000 }, { d: "T3", v: 1320000 }, { d: "T4", v: 980000 }, { d: "T5", v: 1450000 },
  { d: "T6", v: 1680000 }, { d: "T7", v: 1920000 }, { d: "CN", v: 1480000 },
];

function Page() {
  const max = Math.max(...days.map(d => d.v));
  return (
    <MobileShell nav={<VendorBottomNav />}>
      <AppHeader title="Doanh thu" />
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <KPIStatCard label="Doanh thu hôm nay" value={formatVnd(1480000)} accent="primary" />
        <KPIStatCard label="Đơn hôm nay" value="12" accent="info" hint="+3 so với hôm qua" />
      </div>

      <div className="mx-4 mt-4 rounded-2xl border bg-card p-4">
        <p className="mb-3 text-base font-bold">Doanh thu 7 ngày</p>
        <div className="flex h-40 items-end justify-between gap-2">
          {days.map(d => (
            <div key={d.d} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60" style={{ height: `${(d.v / max) * 100}%` }} />
              </div>
              <span className="text-[10px] font-semibold">{d.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-2xl border bg-card p-4">
        <p className="text-base font-bold">Món bán chạy</p>
        <ol className="mt-2 space-y-2 text-sm">
          {["Cá thu tươi","Tôm sú loại 1","Cá diêu hồng","Mực ống tươi"].map((n, i) => (
            <li key={n} className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i+1}</span>
              <span className="flex-1 font-semibold">{n}</span>
              <span className="text-xs text-muted-foreground">{40 - i * 8} đơn</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-4 my-4 rounded-2xl border bg-card p-4">
        <p className="text-base font-bold">Lịch sử giao dịch</p>
        <ul className="mt-2 divide-y text-sm">
          {[1,2,3,4].map(i => (
            <li key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold">Đơn #CNM-241000{i}</p>
                <p className="text-xs text-muted-foreground">21/10 · 07:3{i}</p>
              </div>
              <span className="font-bold text-success">+{formatVnd(120000 + i * 35000)}</span>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
