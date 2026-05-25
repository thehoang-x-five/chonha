import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { KPIStatCard } from "@/components/cards";
import { products, orders, formatVnd } from "@/lib/mock-data";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/vendor/dashboard")({ component: Page });

function Page() {
  const stallProducts = products.filter(p => p.stallId === "s1");
  const [stocks, setStocks] = useState(() => Object.fromEntries(stallProducts.map(p => [p.id, p.inStock])));

  return (
    <MobileShell nav={<VendorBottomNav />}>
      <AppHeader title="Sạp Cá Cô Lan" subtitle="Hôm nay – 21/10/2024" />
      <div className="px-4 pt-4">
        <p className="text-xl font-bold">Chào cô Lan,</p>
        <p className="text-base text-muted-foreground">Chúc cô bán đắt hàng hôm nay! 🎉</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        <KPIStatCard label="Đơn mới" value="4" accent="secondary" hint="Cần xử lý" />
        <KPIStatCard label="Đang chuẩn bị" value="3" accent="warning" />
        <KPIStatCard label="Chờ tài xế lấy" value="2" accent="info" />
        <KPIStatCard label="Doanh thu" value={formatVnd(1480000)} accent="primary" hint="Hôm nay" />
      </div>

      <div className="px-4 pt-4">
        <Link to="/vendor/orders" className="flex h-16 items-center justify-between rounded-2xl bg-primary px-5 text-base font-bold text-primary-foreground active:scale-[0.98]">
          Xem 4 đơn mới <ArrowRight className="h-6 w-6" />
        </Link>
      </div>

      <div className="m-4 flex items-start gap-3 rounded-2xl border border-warning/50 bg-warning/15 p-4">
        <AlertTriangle className="mt-0.5 h-6 w-6 text-warning" />
        <div>
          <p className="font-bold">Tôm sú loại 1 sắp hết hàng</p>
          <p className="text-sm text-muted-foreground">Cô có muốn báo hết hàng không?</p>
        </div>
      </div>

      <div className="mx-4 mb-6 rounded-2xl border bg-card p-3">
        <p className="mb-2 text-base font-bold">Tình trạng sản phẩm</p>
        <ul className="divide-y">
          {stallProducts.map(p => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <span className="text-3xl">{p.image}</span>
              <span className="flex-1 text-base font-semibold">{p.name}</span>
              <button onClick={() => setStocks(s => ({ ...s, [p.id]: !s[p.id] }))} className={`rounded-full px-4 py-2 text-sm font-bold ${stocks[p.id] ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                {stocks[p.id] ? "Còn hàng" : "Hết hàng"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
