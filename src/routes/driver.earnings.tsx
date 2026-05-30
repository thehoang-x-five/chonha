import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { KPIStatCard } from "@/components/cards";
import { formatVnd } from "@/lib/mock-data";
import { TrendingUp, Wallet, Gift } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/driver/earnings")({ component: Page });

const tabs = [
  { key: "day", label: "Hôm nay", value: 285000, trips: 8 },
  { key: "week", label: "Tuần này", value: 1820000, trips: 38 },
  { key: "month", label: "Tháng", value: 7450000, trips: 162 },
] as const;

function Page() {
  const [tab, setTab] = useState<typeof tabs[number]["key"]>("day");
  const current = tabs.find(t => t.key === tab)!;

  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Thu nhập" />

      {/* Hero */}
      <div className="mx-4 mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-5 text-primary-foreground shadow">
        <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
          <Wallet className="h-4 w-4" /> Số dư ví
        </div>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">{formatVnd(current.value)}</p>
        <p className="mt-1 text-xs opacity-90">{current.trips} cuốc · {current.label.toLowerCase()}</p>
        <button className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">Rút về ngân hàng</button>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-3 flex gap-1 rounded-full border bg-card p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <KPIStatCard label="Phí ship" value={formatVnd(current.value * 0.85)} accent="primary" />
        <KPIStatCard label="Thưởng" value={formatVnd(current.value * 0.15)} accent="secondary" />
      </div>

      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold inline-flex items-center gap-1.5"><Gift className="h-4 w-4 text-secondary" /> Thưởng tuần</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary"><TrendingUp className="h-3 w-3" />+{formatVnd(45000)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-secondary" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">38/50 cuốc · Còn 12 cuốc nhận thưởng {formatVnd(100000)}</p>
      </div>

      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <p className="text-base font-bold">Lịch sử cuốc</p>
        <ul className="mt-2 divide-y text-sm">
          {[
            { route: "Chợ Tân Mỹ → Q.7 Sunrise", stalls: 3, time: "21/10 · 07:12", amount: 32000 },
            { route: "Chợ Tân Mỹ → Phú Mỹ Hưng", stalls: 2, time: "21/10 · 08:05", amount: 28000 },
            { route: "Chợ Phước Long → Q.7", stalls: 1, time: "21/10 · 09:30", amount: 25000 },
            { route: "Chợ Tân Mỹ → Riverside", stalls: 4, time: "20/10 · 16:42", amount: 36000 },
            { route: "Chợ Tân Quy → Era Town", stalls: 2, time: "20/10 · 11:18", amount: 30000 },
          ].map((t, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{t.route}</p>
                <p className="text-xs text-muted-foreground">{t.stalls} sạp · {t.time}</p>
              </div>
              <span className="font-bold text-success">+{formatVnd(t.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-8" />
    </MobileShell>
  );
}
