import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { products, formatVnd } from "@/lib/mock-data";
import { Plus, Pencil, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/vendor/products")({ component: Page });

function Page() {
  const mine = products.filter(p => p.stallId === "s1");
  const [stocks, setStocks] = useState(() => Object.fromEntries(mine.map(p => [p.id, p.inStock])));
  return (
    <MobileShell nav={<VendorBottomNav />}>
      <AppHeader title="Sản phẩm của tôi" />
      <ul className="space-y-3 px-4 pt-3 pb-4">
        {mine.map(p => (
          <li key={p.id} className="rounded-2xl border bg-card p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-accent text-4xl">{p.image}</div>
              <div className="flex-1">
                <p className="text-base font-bold">{p.name}</p>
                <p className="text-lg font-extrabold text-primary">{formatVnd(p.price)}<span className="text-sm font-normal text-muted-foreground">/{p.unit}</span></p>
              </div>
              <button onClick={() => setStocks(s => ({ ...s, [p.id]: !s[p.id] }))} className={`rounded-full px-3 py-2 text-xs font-bold ${stocks[p.id] ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                {stocks[p.id] ? "Còn hàng" : "Hết hàng"}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/vendor/products/new" className="flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold"><Pencil className="h-4 w-4" />Sửa giá</Link>
              <button className="flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold"><ImageIcon className="h-4 w-4" />Sửa ảnh</button>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/vendor/products/new" className="fixed bottom-24 right-1/2 z-30 flex translate-x-[180px] items-center gap-2 rounded-full bg-secondary px-5 py-4 text-sm font-bold text-secondary-foreground shadow-lg active:scale-95">
        <Plus className="h-5 w-5" /> Thêm sản phẩm
      </Link>
    </MobileShell>
  );
}
