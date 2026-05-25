import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBasket, AlertCircle, Tag } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/cards";
import { cart, useCart } from "@/lib/cart-store";
import { formatVnd, getProduct, getStall, getMarket } from "@/lib/mock-data";

export const Route = createFileRoute("/customer/cart")({ component: Page });

function Page() {
  const { items, subtotal, stallGroups, marketId } = useCart();
  const market = marketId ? getMarket(marketId) : null;
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <MobileShell nav={<CustomerBottomNav />}>
        <AppHeader title="Giỏ đi chợ" />
        <EmptyState icon={ShoppingBasket} title="Giỏ hàng còn trống" description="Thêm cá tươi, rau xanh hoặc trái cây để bắt đầu đi chợ nhé!" action={<Link to="/customer/home" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Bắt đầu đi chợ</Link>} />
      </MobileShell>
    );
  }

  const deliveryFee = market?.deliveryFeeFrom ?? 18000;
  const serviceFee = 5000;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <MobileShell nav={<CustomerBottomNav />} padBottom={false}>
      <AppHeader title="Giỏ đi chợ" subtitle={market ? `Mua tại ${market.name}` : undefined} />
      <div className="px-4 pb-44 pt-3 space-y-3">
        <div className="rounded-2xl border bg-info/10 p-3 text-xs text-foreground">
          <p className="flex gap-2"><AlertCircle className="h-4 w-4 shrink-0 text-info" />Mỗi đơn hiện chỉ hỗ trợ mua trong cùng một chợ để giao hàng nhanh và giữ độ tươi.</p>
        </div>

        {Object.entries(stallGroups).map(([stallId, list]) => {
          const stall = getStall(stallId)!;
          return (
            <div key={stallId} className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
                <span className="text-xl">{stall.cover}</span>
                <p className="text-sm font-semibold">{stall.name}</p>
              </div>
              <ul className="divide-y">
                {list.map(item => {
                  const p = getProduct(item.productId)!;
                  return (
                    <li key={item.productId + (item.prep || "")} className="flex gap-3 p-3">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-accent text-3xl">{p.image}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        {item.prep && <p className="text-xs text-muted-foreground">Sơ chế: {item.prep}</p>}
                        {item.note && <p className="truncate text-xs text-muted-foreground">Ghi chú: {item.note}</p>}
                        <p className="mt-1 text-sm font-bold text-primary">{formatVnd(p.price * item.qty)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => cart.remove(item.productId)} className="tap-target grid place-items-center text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                        <div className="inline-flex items-center gap-1 rounded-full border bg-background">
                          <button onClick={() => cart.updateQty(item.productId, +(item.qty - 0.5).toFixed(2))} className="tap-target grid place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="min-w-[40px] text-center text-xs font-semibold">{item.qty} {p.unit}</span>
                          <button onClick={() => cart.updateQty(item.productId, +(item.qty + 0.5).toFixed(2))} className="tap-target grid place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div className="flex items-center gap-2 rounded-2xl border bg-card p-3">
          <Tag className="h-4 w-4 text-secondary" />
          <input placeholder="Nhập mã ưu đãi" className="flex-1 bg-transparent text-sm outline-none" />
          <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">Áp dụng</button>
        </div>

        <div className="rounded-2xl border bg-card p-3 text-sm">
          <Row label="Tạm tính" value={formatVnd(subtotal)} />
          <Row label="Phí giao hàng" value={formatVnd(deliveryFee)} />
          <Row label="Phí dịch vụ" value={formatVnd(serviceFee)} />
          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <span className="font-semibold">Tổng cộng</span>
            <span className="text-lg font-extrabold text-primary">{formatVnd(total)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3 safe-bottom">
        <button onClick={() => nav({ to: "/customer/checkout" })} className="h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.98]">
          Tiến hành thanh toán · {formatVnd(total)}
        </button>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-0.5"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
