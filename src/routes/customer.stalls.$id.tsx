import { createFileRoute, notFound } from "@tanstack/react-router";
import { Phone, MessageCircle, Heart, Star, Award } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { ProductCard } from "@/components/cards";
import { getStall, getMarket, getProductsByStall } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { stallService } from "@/services/stallService";
import { notifyTodo } from "@/lib/notify";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/stalls/$id")({
  component: Page,
  loader: ({ params }) => {
    const s = getStall(params.id);
    if (!s) throw notFound();
    return s;
  },
});

const filters = ["Tất cả", "Cá", "Tôm", "Mực", "Đã làm sạch"];

function Page() {
  const stall = Route.useLoaderData();
  const market = getMarket(stall.marketId)!;
  const allProducts = getProductsByStall(stall.id);
  const [f, setF] = useState("Tất cả");
  const [following, setFollowing] = useState<boolean>(() => stallService.isFollowed(stall.id));
  const products = f === "Tất cả" ? allProducts : allProducts.filter(p => p.name.toLowerCase().includes(f.toLowerCase()));

  useEffect(() => { setFollowing(stallService.isFollowed(stall.id)); }, [stall.id]);

  const toggleFollow = async () => {
    try {
      if (following) { await stallService.unfollowStall(stall.id); toast.success("Đã bỏ theo dõi sạp"); }
      else { await stallService.followStall(stall.id); toast.success(`Đã theo dõi ${stall.name}`); }
      setFollowing(!following);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Lỗi"); }
  };

  return (
    <MobileShell nav={<CustomerBottomNav />} area="customer">
      <AppHeader title={stall.name} back={`/customer/markets/${stall.marketId}` as any} right={
        <button onClick={toggleFollow} aria-label={following ? "Bỏ theo dõi" : "Theo dõi"} className="tap-target grid place-items-center">
          <Heart className={`h-5 w-5 ${following ? "fill-destructive text-destructive" : ""}`} />
        </button>
      } />

      <div className="grid h-44 place-items-center bg-gradient-to-br from-secondary/20 to-primary/15 text-7xl">{stall.cover}</div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl">{stall.avatar}</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{stall.owner}</p>
            <p className="text-xs text-muted-foreground">{stall.owner} bán tại {market.name} hơn {stall.yearsActive} năm</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button onClick={toggleFollow} className={`flex-1 rounded-2xl px-3 py-2.5 text-sm font-semibold ${following ? "border bg-card" : "bg-primary text-primary-foreground"}`}>
            {following ? "Đang theo dõi" : "Theo dõi sạp"}
          </button>
          <button onClick={() => notifyTodo("Gọi điện sạp")} className="tap-target grid place-items-center rounded-2xl border bg-card px-3"><Phone className="h-4 w-4" /></button>
          <button onClick={() => notifyTodo("Nhắn tin sạp")} className="tap-target grid place-items-center rounded-2xl border bg-card px-3"><MessageCircle className="h-4 w-4" /></button>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{stall.rating}</span>
          <span className="text-muted-foreground">· {stall.specialty}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {stall.badges.map((b: string) => (
            <span key={b} className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
              <Award className="h-3 w-3" /> {b}
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-14 z-20 mt-4 border-b bg-background/95 px-4 py-2 backdrop-blur">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-hide">
          {filters.map(t => (
            <button key={t} onClick={() => setF(t)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${f === t ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Không có sản phẩm</p>}
      </div>
    </MobileShell>
  );
}
