import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { KPIStatCard } from "@/components/cards";
import { formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/driver/earnings")({ component: Page });

function Page() {
  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Thu nhập" />
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <KPIStatCard label="Hôm nay" value={formatVnd(285000)} accent="primary" />
        <KPIStatCard label="Tuần này" value={formatVnd(1820000)} accent="info" />
        <KPIStatCard label="Tháng" value={formatVnd(7450000)} accent="secondary" />
      </div>
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div><p className="text-2xl font-extrabold">38</p><p className="text-xs text-muted-foreground">Cuốc tuần này</p></div>
          <div><p className="text-2xl font-extrabold text-secondary">+{formatVnd(45000)}</p><p className="text-xs text-muted-foreground">Thưởng cuối tuần</p></div>
        </div>
      </div>
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="text-base font-bold">Lịch sử cuốc</p>
        <ul className="mt-2 divide-y text-sm">
          {[1,2,3,4,5,6].map(i => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold">Chợ Tân Mỹ → Q.7</p>
                <p className="text-xs text-muted-foreground">3 sạp · 21/10 · 07:{String(10 + i).padStart(2,"0")}</p>
              </div>
              <span className="font-bold text-success">+{formatVnd(28000 + i * 2500)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-8" />
    </MobileShell>
  );
}
