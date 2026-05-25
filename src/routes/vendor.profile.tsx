import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { Star, MapPin, Clock, Pencil, HelpCircle, LogOut } from "lucide-react";

export const Route = createFileRoute("/vendor/profile")({ component: Page });

function Page() {
  return (
    <MobileShell nav={<VendorBottomNav />}>
      <AppHeader title="Gian hàng của tôi" />
      <div className="grid h-44 place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 text-7xl">🐟</div>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-3xl shadow-sm">👩‍🦳</div>
          <div>
            <p className="text-lg font-bold">Cô Lan</p>
            <p className="text-sm">Sạp Cá Cô Lan</p>
            <p className="text-xs text-muted-foreground">Chủ gian hàng từ 2006</p>
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-base"><MapPin className="h-5 w-5 text-primary" /><span>Chợ Tân Mỹ, Quận 7</span></li>
          <li className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-base"><Clock className="h-5 w-5 text-primary" /><span>Mở cửa 5:00 – 14:00</span></li>
          <li className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-base"><Star className="h-5 w-5 fill-warning text-warning" /><span>Đánh giá 4.9 · 1.280 đơn</span></li>
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground"><Pencil className="h-4 w-4" />Sửa gian hàng</button>
          <button className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-4 text-base font-bold"><HelpCircle className="h-4 w-4" />Trợ giúp</button>
        </div>

        <Link to="/" className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </Link>
      </div>
    </MobileShell>
  );
}
