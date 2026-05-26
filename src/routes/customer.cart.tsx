import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBasket, AlertCircle, Tag, Sparkles, Store, ChevronRight, Bike } from "lucide-react";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/cards";
import { cart, useCart } from "@/lib/cart-store";
import { formatVnd, getProduct, getStall, getMarket } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/customer/cart")({ component: Page });

const FREE_SHIP = 200000;

function Page() {
  const { items, subtotal, stallGroups, marketId } = useCart();
  const market = marketId ? getMarket(marketId) : null;
  const nav = useNavigate();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  if (items.length === 0) {
    return (
      <MobileShell nav={<CustomerBottomNav />}>
        <AppHeader title="Giỏ đi chợ" />
        <EmptyState
          emoji="🧺"
          title="Giỏ chợ còn trống"
          description="Thêm cá tươi, rau xanh hoặc trái cây để bắt đầu đi chợ nhé!"
          action={<Link to="/customer/home" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md">Bắt đầu đi chợ</Link>}
        />
      </MobileShell>
    );
  }

  const deliveryFeeBase = market?.deliveryFeeFrom ?? 18000;
  const deliveryFee = subtotal >= FREE_SHIP ? 0 : deliveryFeeBase;
  const serviceFee = 5000;
  const total = subtotal + deliveryFee + serviceFee - discount;
  const stallCount = Object.keys(stallGroups).length;
  const toFreeShip = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.toUpperCase() === "TUOI10") {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success("Đã áp dụng mã TUOI10 – giảm 10%");
    } else {
      toast.error("Mã không hợp lệ hoặc đã hết hạn");
    }
  };

  return (
    <MobileShell nav={<CustomerBottomNav />} padBottom={false}>
      <AppHeader title="Giỏ đi chợ" subtitle={market ? `${market.name} · ${stallCount} sạp` : undefined} right={
        <button onClick={() => setClearOpen(true)} className="tap-target grid place-items-center text-muted-foreground"><Trash2 className="h-5 w-5" /></button>
      } />

      <div className="px-4 pb-44 pt-3 space-y-3">
        {/* Free-ship progress */}
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-secondary/10 p-3">
          <div className="flex items-center gap-2 text-xs">
            <Bike className="h-4 w-4 text-primary" />
            {toFreeShip > 0 ? (
              <p>Mua thêm <span className="font-bold text-primary">{formatVnd(toFreeShip)}</span> để được <b>miễn phí giao hàng</b></p>
            ) : (
              <p className="font-semibold text-success">🎉 Đơn của bạn được miễn phí giao hàng!</p>
            )}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border bg-info/10 p-3 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-info" />
          <p>Mỗi đơn hiện chỉ hỗ trợ mua trong cùng một chợ để giao hàng nhanh và giữ độ tươi.</p>
        </div>

        {Object.entries(stallGroups).map(([stallId, list]) => {
          const stall = getStall(stallId)!;
          const stallTotal = list.reduce((s, i) => s + (getProduct(i.productId)?.price ?? 0) * i.qty, 0);
          return (
            <div key={stallId} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <Link to="/customer/stalls/$id" params={{ id: stall.id }} className="flex items-center gap-2 border-b bg-gradient-to-r from-accent/60 to-muted/40 px-3 py-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-card text-lg">{stall.avatar}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{stall.name}</p>
                  <p className="text-[11px] text-muted-foreground">{list.length} món · {formatVnd(stallTotal)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <ul className="divide-y">
                {list.map(item => {
                  const p = getProduct(item.productId)!;
                  return (
                    <li key={item.productId + (item.prep || "")} className="flex gap-3 p-3">
                      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-muted text-3xl">
                        {p.image}
                        {p.freshNote && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-success text-success-foreground"><Sparkles className="h-3 w-3" /></span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        {item.prep && <p className="text-[11px] text-muted-foreground">Sơ chế: <span className="font-medium text-foreground">{item.prep}</span></p>}
                        {item.note && <p className="truncate text-[11px] text-muted-foreground">Ghi chú: {item.note}</p>}
                        <p className="mt-1 text-sm font-extrabold text-primary">{formatVnd(p.price * item.qty)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between gap-2">
                        <button onClick={() => setRemoveId(item.productId)} className="tap-target grid place-items-center text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                        <div className="inline-flex items-center gap-1 rounded-full border bg-background">
                          <button onClick={() => cart.updateQty(item.productId, +(item.qty - 0.5).toFixed(2))} className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="min-w-[44px] text-center text-xs font-bold">{item.qty} {p.unit}</span>
                          <button onClick={() => cart.updateQty(item.productId, +(item.qty + 0.5).toFixed(2))} className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <Link to="/customer/markets/$id" params={{ id: marketId! }} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-card py-3 text-sm font-semibold text-primary">
          <Store className="h-4 w-4" /> Thêm sạp khác trong chợ này
        </Link>

        <div className="flex items-center gap-2 rounded-2xl border bg-card p-2">
          <Tag className="ml-1 h-4 w-4 text-secondary" />
          <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Nhập mã ưu đãi (thử TUOI10)" className="flex-1 bg-transparent px-1 text-sm outline-none" />
          <button onClick={applyCoupon} className="rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground">Áp dụng</button>
        </div>

        <div className="rounded-2xl border bg-card p-3 text-sm">
          <Row label="Tạm tính" value={formatVnd(subtotal)} />
          <Row label="Phí giao hàng" value={deliveryFee === 0 ? "Miễn phí" : formatVnd(deliveryFee)} accent={deliveryFee === 0 ? "success" : undefined} />
          <Row label="Phí dịch vụ" value={formatVnd(serviceFee)} />
          {discount > 0 && <Row label="Giảm giá" value={`- ${formatVnd(discount)}`} accent="success" />}
          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <span className="font-bold">Tổng cộng</span>
            <span className="text-xl font-extrabold text-primary">{formatVnd(total)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <button onClick={() => nav({ to: "/customer/checkout" })} className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-base font-extrabold text-primary-foreground active:scale-[0.98]">
          <span>Tiến hành thanh toán</span>
          <span>{formatVnd(total)}</span>
        </button>
      </div>

      <AlertDialog open={!!removeId} onOpenChange={o => !o && setRemoveId(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ món này khỏi giỏ?</AlertDialogTitle>
            <AlertDialogDescription>Bạn có thể thêm lại bất cứ lúc nào từ trang sạp.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (removeId) { cart.remove(removeId); toast.success("Đã xoá khỏi giỏ"); } setRemoveId(null); }}>
              Xoá món
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá toàn bộ giỏ chợ?</AlertDialogTitle>
            <AlertDialogDescription>Tất cả {items.length} món từ {stallCount} sạp sẽ bị xoá.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={() => { cart.clear(); toast.success("Đã xoá giỏ chợ"); }}>
              Xoá hết
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "success" }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${accent === "success" ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}
