import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Bell, ChevronRight } from "lucide-react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/app-shell";
import { MarketCard, StallCard, ProductCard } from "@/components/cards";
import { markets, stalls, products, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/customer/home")({ component: Page });

function Page() {
  const popular = products.slice(0, 6);
  const favStalls = stalls.slice(0, 4);

  return (
    <MobileShell nav={<CustomerBottomNav />}>
      {/* Top */}
      <div className="safe-top bg-gradient-to-b from-primary/15 to-transparent px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground">Giao đến</p>
            <button className="flex max-w-[260px] items-center gap-1 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">112 Nguyễn Thị Thập, Quận 7</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button className="tap-target relative grid place-items-center rounded-full bg-card shadow-sm">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          </button>
        </div>

        <Link to="/customer/home" className="mt-3 flex h-12 items-center gap-2 rounded-2xl bg-card px-4 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Tìm cá, rau, thịt hoặc gian hàng…</span>
        </Link>
      </div>

      {/* Banner */}
      <div className="px-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 p-4 text-secondary-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Ưu đãi sáng nay</p>
          <h2 className="mt-1 text-lg font-bold leading-tight">Đi chợ sáng – đồ tươi giao tận nhà</h2>
          <p className="mt-1 text-xs opacity-90">Miễn phí giao đơn từ 200.000 đ trước 9:00</p>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5 px-4">
        <h3 className="text-sm font-bold">Danh mục</h3>
        <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 scrollbar-hide">
          {categories.map(c => (
            <button key={c.name} className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border bg-card px-3 py-2 text-xs font-medium">
              <span className="text-2xl">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Markets */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Chợ gần bạn</h3>
          <button className="text-xs font-medium text-primary">Xem tất cả</button>
        </div>
        <div className="mt-2 space-y-2">
          {markets.map(m => <MarketCard key={m.id} market={m} />)}
        </div>
      </div>

      {/* Favorite stalls */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Sạp quen của bạn</h3>
          <Link to="/customer/favorites" className="text-xs font-medium text-primary">Xem tất cả</Link>
        </div>
        <div className="-mx-1 mt-2 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {favStalls.map(s => (
            <div key={s.id} className="w-40 shrink-0"><StallCard stall={s} /></div>
          ))}
        </div>
      </div>

      {/* Popular */}
      <div className="mt-6 px-4">
        <h3 className="text-sm font-bold">Đồ tươi nổi bật</h3>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {popular.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </MobileShell>
  );
}
