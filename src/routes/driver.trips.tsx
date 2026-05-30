import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/cards";
import { StatusBadge } from "@/components/status-badge";
import { formatVnd, orders, getMarket } from "@/lib/mock-data";
import { Package, MapPin, ChevronRight, CheckCircle2, Inbox } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/driver/trips")({ component: Page });

const tabs = [
  { key: "active", label: "Đang chạy" },
  { key: "done", label: "Đã giao" },
] as const;

function Page() {
  const [tab, setTab] = useState<typeof tabs[number]["key"]>("active");
  const active = orders.filter(o => ["picking", "delivering"].includes(o.status));
  // For demo, treat 'o1' as active
  const list = tab === "active" ? (active.length ? active : [orders[0]]) : orders.filter(o => o.status === "completed");

  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Cuốc giao" />

      <div className="sticky top-14 z-20 border-b bg-card/95 px-4 backdrop-blur">
        <div className="flex gap-1 py-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-4 pt-3">
        {list.length === 0 && (
          <EmptyState icon={Inbox} title="Chưa có cuốc giao" description="Khi có cuốc mới, hệ thống sẽ báo cho bạn." />
        )}
        {list.map(o => {
          const m = getMarket(o.marketId)!;
          const stallCount = new Set(o.items.map(i => i.stallId)).size;
          const done = o.status === "completed";
          return (
            <Link key={o.id} to="/driver/trips/$id" params={{ id: o.id }} className="block">
              <div className="rounded-2xl border bg-card p-4 shadow-sm transition active:scale-[0.99]">
                <div className="flex items-center gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${done ? "bg-success/15 text-success" : "bg-primary/15 text-primary"}`}>
                    {done ? <CheckCircle2 className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-bold">#{o.code}</p>
                      <span className="text-sm font-extrabold text-primary">{formatVnd(28000)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{stallCount} sạp · {m.name}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{o.address}</span>
                  {done ? <StatusBadge variant="success">Hoàn tất</StatusBadge> : <StatusBadge variant="info">Đang chạy</StatusBadge>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}
