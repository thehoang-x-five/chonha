import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { MapPlaceholder, StallCard } from "@/components/cards";
import { getMarket, getStallsByMarket } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/customer/markets/$id")({
  component: Page,
  loader: ({ params }) => {
    const m = getMarket(params.id);
    if (!m) throw notFound();
    return m;
  },
});

const tabs = ["Tất cả", "Hải sản", "Thịt", "Rau củ", "Trái cây"] as const;

function Page() {
  const market = Route.useLoaderData();
  const stalls = getStallsByMarket(market.id);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Tất cả");
  const filtered = tab === "Tất cả" ? stalls : stalls.filter(s =>
    (tab === "Hải sản" && s.category === "Cá & Hải sản") ||
    (tab === "Thịt" && s.category === "Thịt") ||
    (tab === "Rau củ" && s.category === "Rau củ") ||
    (tab === "Trái cây" && s.category === "Trái cây")
  );

  return (
    <MobileShell nav={<CustomerBottomNav />}>
      <AppHeader title={market.name} back="/customer/home" right={<button className="tap-target grid place-items-center"><Heart className="h-5 w-5" /></button>} />
      <div className="grid h-40 place-items-center bg-gradient-to-br from-primary/15 to-secondary/15 text-7xl">{market.cover}</div>
      <div className="px-4 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{market.rating}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{market.openingHours}</span>
          <span>·</span>
          <span>{market.stallCount} sạp</span>
        </div>
        <p className="mt-1 flex items-start gap-1 text-sm"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{market.address}</p>
      </div>

      <div className="mt-4 px-4">
        <MapPlaceholder className="h-32" label={`Vị trí ${market.name}`} />
      </div>

      <div className="sticky top-14 z-20 mt-4 -mx-0 border-b bg-background/95 px-4 py-2 backdrop-blur">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-hide">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${tab === t ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <h3 className="text-sm font-bold">Các gian hàng trong chợ</h3>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {filtered.map(s => <StallCard key={s.id} stall={s} />)}
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Không có sạp phù hợp</p>}
      </div>
    </MobileShell>
  );
}
