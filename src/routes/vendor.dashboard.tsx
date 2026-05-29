import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { VendorHeader, UrgentOrderAlert, OnboardingCard, BigActionButton } from "@/components/vendor";
import { products, orders, formatVnd } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, Package, Truck, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor/dashboard")({ component: Page });

function Page() {
  const stallProducts = products.filter(p => p.stallId === "s1");
  const [stocks, setStocks] = useState(() => Object.fromEntries(stallProducts.map(p => [p.id, p.inStock])));
  const myOrders = orders.filter(o => o.items.some(i => i.stallId === "s1"));
  const newCount = myOrders.filter(o => o.status === "confirmed").length || 2; // demo fallback
  const preparing = myOrders.filter(o => o.status === "preparing").length || 3;
  const waitingDriver = myOrders.filter(o => o.status === "finding_driver" || o.status === "picking").length || 2;

  const toggleStock = (id: string) => {
    setStocks(s => {
      const v = !s[id];
      toast.success(v ? "Đã báo còn hàng" : "Đã báo hết hàng");
      return { ...s, [id]: v };
    });
  };

  return (
    <MobileShell nav={<VendorBottomNav />}>
      <VendorHeader title="Sạp Cá Cô Lan" subtitle="Hôm nay – Thứ Ba, 21/10" />

      <div className="px-4 pt-5">
        <p className="text-2xl font-extrabold leading-tight">Chào cô Lan, 🌸</p>
        <p className="mt-1 text-base text-muted-foreground">Chúc cô bán đắt hàng, vui khoẻ hôm nay!</p>
      </div>

      <UrgentOrderAlert count={newCount} to="/vendor/orders" />

      <OnboardingCard />

      {/* Big simple stat tiles */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <StatTile icon={<Package className="h-6 w-6" />} label="Đơn mới" value={String(newCount)} tone="secondary" />
        <StatTile icon={<TrendingUp className="h-6 w-6" />} label="Đang chuẩn bị" value={String(preparing)} tone="warning" />
        <StatTile icon={<Truck className="h-6 w-6" />} label="Chờ tài xế" value={String(waitingDriver)} tone="info" />
        <StatTile icon={<CircleDollarSign className="h-6 w-6" />} label="Doanh thu" value={formatVnd(1480000)} tone="primary" small />
      </div>

      {/* Primary CTA */}
      <div className="px-4 pt-5">
        <BigActionButton as="link" to="/vendor/orders" variant="primary">
          Xem {newCount} đơn cần xử lý →
        </BigActionButton>
      </div>

      {/* Low-stock warning */}
      <div className="mx-4 mt-5 flex items-start gap-3 rounded-3xl border-2 border-warning/60 bg-warning/15 p-4">
        <AlertTriangle className="mt-0.5 h-7 w-7 text-warning" />
        <div className="flex-1">
          <p className="text-lg font-extrabold">Tôm sú loại 1 sắp hết</p>
          <p className="mt-0.5 text-base text-foreground/80">Cô có muốn báo hết hàng cho khách biết không?</p>
          <button onClick={() => toggleStock("p3")} className="mt-3 h-12 rounded-2xl bg-warning px-5 text-base font-extrabold text-foreground active:scale-95">
            Báo hết hàng
          </button>
        </div>
      </div>

      {/* Quick stock toggles */}
      <div className="mx-4 mt-5 rounded-3xl border-2 bg-card p-4">
        <p className="mb-1 text-lg font-extrabold">Tình trạng hàng hôm nay</p>
        <p className="mb-3 text-sm text-muted-foreground">Bấm vào nút để báo còn hàng hoặc hết hàng.</p>
        <ul className="divide-y">
          {stallProducts.map(p => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <span className="text-4xl">{p.image}</span>
              <span className="flex-1 text-lg font-bold leading-tight">{p.name}</span>
              <button
                onClick={() => toggleStock(p.id)}
                className={`h-12 rounded-full px-4 text-base font-extrabold ${stocks[p.id] ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}
              >
                {stocks[p.id] ? "Còn hàng" : "Hết hàng"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 pt-5">
        <Link to="/vendor/products" className="block text-center text-base font-semibold text-primary underline-offset-2 hover:underline">
          Quản lý tất cả sản phẩm
        </Link>
      </div>
    </MobileShell>
  );
}

function StatTile({ icon, label, value, tone, small }: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "secondary" | "warning" | "info"; small?: boolean }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    warning: "bg-warning/20 text-foreground",
    info: "bg-info/15 text-info",
  };
  return (
    <div className="rounded-3xl border-2 bg-card p-4">
      <div className={`mb-2 grid h-10 w-10 place-items-center rounded-2xl ${map[tone]}`}>{icon}</div>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-extrabold leading-none ${small ? "text-xl" : "text-3xl"}`}>{value}</p>
    </div>
  );
}
