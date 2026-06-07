import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Bell, ChevronRight, Sparkles, Clock, Bike, Flame, TrendingUp } from "lucide-react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/app-shell";
import { MarketCard, StallCard, ProductCard } from "@/components/cards";
import { markets, stalls, products, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/customer/home")({ component: Page });

const greeting = () => {
  const h = new Date().getHours();
  if (h < 11) return { text: "Chào buổi sáng", emoji: "🌅", sub: "Đồ tươi vừa về chợ" };
  if (h < 14) return { text: "Chào buổi trưa", emoji: "🍱", sub: "Nấu nhanh gì cho gia đình?" };
  if (h < 18) return { text: "Chào buổi chiều", emoji: "🌤️", sub: "Còn kịp đặt cho bữa tối" };
  return { text: "Chào buổi tối", emoji: "🌙", sub: "Đặt sẵn cho chợ sáng mai" };
};

function Page() {
  const popular = products.filter(p => p.inStock).slice(0, 6);
  const favStalls = stalls.slice(0, 5);
  const g = greeting();

  return (
    <MobileShell nav={<CustomerBottomNav />}>
      {/* Top */}
      <div className="safe-top relative overflow-hidden px-4 pt-3 pb-5">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/90">Giao đến</p>
            <button className="flex max-w-[260px] items-center gap-1 text-sm font-bold">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">112 Nguyễn Thị Thập, Q.7</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <Link
            to="/customer/notifications"
            aria-label="Thông báo"
            className="tap-target relative grid place-items-center rounded-full bg-card shadow-md"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-card" />
          </Link>
        </div>

        <div className="relative mt-3 flex items-center gap-2 text-sm">
          <span className="text-xl">{g.emoji}</span>
          <div>
            <p className="font-bold leading-tight">{g.text}, chị Mai!</p>
            <p className="text-xs text-muted-foreground">{g.sub}</p>
          </div>
        </div>

        <Link to="/customer/search" className="relative mt-4 flex h-12 items-center gap-2 rounded-2xl bg-card px-4 shadow-md ring-1 ring-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Tìm cá thu, rau muống, sạp Cô Lan…</span>
        </Link>
      </div>

      {/* Promo */}
      <div className="px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/85 to-secondary/60 p-4 text-secondary-foreground shadow-lg">
          <div className="absolute -right-6 -top-6 text-7xl opacity-25">🧺</div>
          <div className="relative">
            <p className="inline-flex items-center gap-1 rounded-full bg-card/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
              <Flame className="h-3 w-3" /> Ưu đãi chợ sáng
            </p>
            <h2 className="mt-2 text-lg font-extrabold leading-tight">Miễn phí giao đơn từ 200K<br/>trước 9 giờ sáng</h2>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium opacity-95">
              <Clock className="h-3 w-3" /> Còn 1 giờ 24 phút
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        {[
          { icon: "⚡", title: "Đặt nhanh", sub: "Lại đơn cũ" },
          { icon: "📋", title: "Đi chợ giúp", sub: "Gửi danh sách" },
          { icon: "🎁", title: "Mã ưu đãi", sub: "Có 3 mã mới" },
        ].map(a => (
          <button key={a.title} className="flex flex-col items-center gap-0.5 rounded-2xl border bg-card p-2.5 shadow-sm transition active:scale-95">
            <span className="text-2xl">{a.icon}</span>
            <p className="text-xs font-bold">{a.title}</p>
            <p className="text-[10px] text-muted-foreground">{a.sub}</p>
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="mt-5 px-4">
        <h3 className="text-sm font-bold">Đi chợ theo nhóm</h3>
        <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {categories.map(c => (
            <button key={c.name} className="flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl border bg-card px-2 py-2.5 text-[11px] font-semibold shadow-sm transition active:scale-95">
              <span className="text-2xl">{c.emoji}</span>
              <span className="leading-tight text-center">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Markets */}
      <div className="mt-5 px-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-base font-extrabold">Chợ gần bạn</h3>
            <p className="text-xs text-muted-foreground">3 chợ truyền thống đang mở</p>
          </div>
          <button className="text-xs font-semibold text-primary">Xem tất cả</button>
        </div>
        <div className="mt-2 space-y-3">
          {markets.map(m => <MarketCard key={m.id} market={m} />)}
        </div>
      </div>

      {/* Favorite stalls */}
      <div className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-base font-extrabold">Sạp quen của bạn</h3>
            <p className="text-xs text-muted-foreground">Mua lại dễ dàng từ các sạp đã quen</p>
          </div>
          <Link to="/customer/favorites" className="text-xs font-semibold text-primary">Xem tất cả</Link>
        </div>
        <div className="-mx-1 mt-2 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {favStalls.map(s => (
            <div key={s.id} className="w-40 shrink-0"><StallCard stall={s} /></div>
          ))}
        </div>
      </div>

      {/* Popular */}
      <div className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-secondary" />
            <h3 className="text-base font-extrabold">Tươi sáng nay</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><TrendingUp className="h-3 w-3" /> Bán chạy</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {popular.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Trust footer */}
      <div className="mx-4 mt-6 rounded-2xl border bg-card p-4 text-center text-xs text-muted-foreground">
        <p className="text-sm font-bold text-foreground">Cam kết chợ tươi mỗi ngày</p>
        <p className="mt-1">Hoàn tiền 100% nếu hàng không tươi · Sơ chế miễn phí · Giao trong 60 phút</p>
      </div>
    </MobileShell>
  );
}
