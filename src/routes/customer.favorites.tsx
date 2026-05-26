import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/cards";
import { stalls, getMarket } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/customer/favorites")({ component: Page });

function Page() {
  const [favorites, setFavorites] = useState(stalls.slice(0, 5));
  const [removeId, setRemoveId] = useState<string | null>(null);
  const target = favorites.find(s => s.id === removeId);

  return (
    <MobileShell nav={<CustomerBottomNav />}>
      <AppHeader title="Sạp quen" subtitle={`${favorites.length} sạp đã theo dõi`} />
      <div className="space-y-3 px-4 pt-3">
        {favorites.map(s => {
          const m = getMarket(s.marketId)!;
          return (
            <div key={s.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center gap-3 p-3">
                <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/15 text-3xl">
                  {s.cover}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.name} · {s.specialty}</p>
                  <p className="mt-0.5 text-[11px] font-semibold"><Star className="mr-0.5 inline h-3 w-3 fill-warning text-warning" />{s.rating} · {s.yearsActive} năm kinh nghiệm</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t bg-muted/30 p-2">
                <Link to="/customer/stalls/$id" params={{ id: s.id }} className="rounded-full bg-primary py-2 text-center text-xs font-bold text-primary-foreground">Xem sản phẩm</Link>
                <button onClick={() => toast.success(`Đã thêm đơn cũ từ ${s.name}`)} className="rounded-full bg-secondary py-2 text-xs font-bold text-secondary-foreground">Đặt lại</button>
                <button onClick={() => setRemoveId(s.id)} className="rounded-full border bg-card py-2 text-xs font-bold">Bỏ theo dõi</button>
              </div>
            </div>
          );
        })}

        {favorites.length === 0 && (
          <EmptyState
            emoji="💚"
            title="Chưa có sạp quen nào"
            description="Theo dõi các sạp yêu thích để mua lại nhanh hơn và nhận ưu đãi riêng."
            action={<Link to="/customer/home" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Khám phá chợ</Link>}
          />
        )}
      </div>

      <AlertDialog open={!!removeId} onOpenChange={o => !o && setRemoveId(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ theo dõi {target?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Bạn sẽ không còn nhận thông báo khi sạp có hàng mới hoặc khuyến mãi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Giữ theo dõi</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setFavorites(favorites.filter(f => f.id !== removeId)); toast.success("Đã bỏ theo dõi sạp"); setRemoveId(null); }}>Bỏ theo dõi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}
