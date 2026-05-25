import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { stalls, getMarket } from "@/lib/mock-data";
import { Star } from "lucide-react";

export const Route = createFileRoute("/customer/favorites")({ component: Page });

function Page() {
  const favorites = stalls.slice(0, 5);
  return (
    <MobileShell nav={<CustomerBottomNav />}>
      <AppHeader title="Sạp quen" />
      <div className="space-y-3 px-4 pt-3">
        {favorites.map(s => {
          const m = getMarket(s.marketId)!;
          return (
            <div key={s.id} className="rounded-2xl border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-accent text-3xl">{s.cover}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.name} · {s.specialty}</p>
                  <p className="text-xs"><Star className="inline h-3 w-3 fill-warning text-warning" /> {s.rating}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Link to="/customer/stalls/$id" params={{ id: s.id }} className="rounded-full bg-primary py-2 text-center text-xs font-semibold text-primary-foreground">Xem sản phẩm</Link>
                <button className="rounded-full bg-secondary py-2 text-xs font-semibold text-secondary-foreground">Đặt lại</button>
                <button className="rounded-full border py-2 text-xs font-semibold">Bỏ theo dõi</button>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
