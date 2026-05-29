import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { VendorHeader, QuickPriceModal } from "@/components/vendor";
import { products, formatVnd, type Product } from "@/lib/mock-data";
import { Plus, Pencil, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor/products")({ component: Page });

function Page() {
  const mine = products.filter(p => p.stallId === "s1");
  const [stocks, setStocks] = useState(() => Object.fromEntries(mine.map(p => [p.id, p.inStock])));
  const [prices, setPrices] = useState<Record<string, number>>(() => Object.fromEntries(mine.map(p => [p.id, p.price])));
  const [editing, setEditing] = useState<Product | null>(null);

  const toggleStock = (id: string) => {
    setStocks(s => {
      const v = !s[id];
      toast.success(v ? "Đã báo còn hàng" : "Đã báo hết hàng");
      return { ...s, [id]: v };
    });
  };

  return (
    <MobileShell nav={<VendorBottomNav />}>
      <VendorHeader title="Sản phẩm của tôi" subtitle="Bấm Sửa giá để đổi giá nhanh" />

      <ul className="space-y-3 px-4 pt-4 pb-28">
        {mine.map(p => (
          <li key={p.id} className="rounded-3xl border-2 bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-accent text-5xl">{p.image}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold leading-tight">{p.name}</p>
                <p className="mt-1 text-xl font-extrabold text-primary">
                  {formatVnd(prices[p.id])}
                  <span className="text-sm font-semibold text-muted-foreground"> / {p.unit}</span>
                </p>
              </div>
              <button
                onClick={() => toggleStock(p.id)}
                className={`h-12 shrink-0 rounded-full px-4 text-base font-extrabold ${stocks[p.id] ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}
              >
                {stocks[p.id] ? "Còn hàng" : "Hết hàng"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setEditing(p)}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-extrabold text-primary-foreground active:scale-[0.98]"
              >
                <Pencil className="h-5 w-5" /> Sửa giá
              </button>
              <button
                onClick={() => toast("Tính năng đổi ảnh sẽ sớm có")}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 bg-card text-base font-bold"
              >
                <ImageIcon className="h-5 w-5" /> Sửa ảnh
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/vendor/products/new"
        className="fixed bottom-24 left-1/2 z-30 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full bg-secondary px-6 text-base font-extrabold text-secondary-foreground shadow-lg active:scale-95"
      >
        <Plus className="h-6 w-6" /> Thêm sản phẩm
      </Link>

      {editing && (
        <QuickPriceModal
          open={!!editing}
          onOpenChange={(v) => !v && setEditing(null)}
          productName={editing.name}
          currentPrice={prices[editing.id]}
          unit={editing.unit}
          onSave={(n) => setPrices(p => ({ ...p, [editing.id]: n }))}
        />
      )}
    </MobileShell>
  );
}
