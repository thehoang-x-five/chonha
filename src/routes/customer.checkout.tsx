import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Phone, Wallet, Banknote, Building2 } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { useCart, cart } from "@/lib/cart-store";
import { formatVnd, getMarket, getStall, getProduct } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/checkout")({ component: Page });

const times = [
  { id: "asap", label: "Giao sớm nhất", hint: "≈ 35 phút" },
  { id: "60", label: "Giao trong 60 phút", hint: "Linh hoạt" },
  { id: "schedule", label: "Đặt giao lúc 17:30", hint: "Hẹn giờ" },
];
const pays = [
  { id: "cash", label: "Tiền mặt khi nhận hàng", icon: Banknote },
  { id: "bank", label: "Chuyển khoản ngân hàng", icon: Building2 },
  { id: "wallet", label: "Ví điện tử (demo)", icon: Wallet },
];

function Page() {
  const { items, subtotal, stallGroups, marketId } = useCart();
  const market = marketId ? getMarket(marketId) : null;
  const nav = useNavigate();
  const [time, setTime] = useState("asap");
  const [pay, setPay] = useState("cash");

  if (items.length === 0) {
    nav({ to: "/customer/cart" });
    return null;
  }

  const deliveryFee = market?.deliveryFeeFrom ?? 18000;
  const serviceFee = 5000;
  const total = subtotal + deliveryFee + serviceFee;

  const place = () => {
    toast.success("Đặt hàng thành công!");
    cart.clear();
    nav({ to: "/customer/orders/$id/tracking", params: { id: "o5" } });
  };

  return (
    <MobileShell padBottom={false}>
      <AppHeader title="Thanh toán" back={true} />
      <div className="space-y-3 px-4 pb-32 pt-3">
        <section className="rounded-2xl border bg-card p-3">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground">Địa chỉ giao hàng</p>
              <p className="text-sm font-medium">112 Nguyễn Thị Thập, Quận 7, TP.HCM</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> 0909 123 456</p>
            </div>
            <button className="text-xs font-semibold text-primary">Đổi</button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thời gian giao</p>
          <div className="space-y-2">
            {times.map(t => (
              <label key={t.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${time === t.id ? "border-primary bg-primary/5" : ""}`}>
                <div className="flex items-center gap-2">
                  <input type="radio" checked={time === t.id} onChange={() => setTime(t.id)} className="h-4 w-4 accent-[color:var(--primary)]" />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t.hint}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phương thức thanh toán</p>
          <div className="space-y-2">
            {pays.map(p => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${pay === p.id ? "border-primary bg-primary/5" : ""}`}>
                <input type="radio" checked={pay === p.id} onChange={() => setPay(p.id)} className="h-4 w-4 accent-[color:var(--primary)]" />
                <p.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{p.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ghi chú cho tài xế</p>
          <textarea rows={2} placeholder="Ví dụ: gọi trước khi đến" className="w-full rounded-xl border bg-background p-2.5 text-sm outline-none focus:border-primary" />
        </section>

        <section className="rounded-2xl border bg-card p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Đơn hàng từ {market?.name}</p>
          <div className="space-y-3">
            {Object.entries(stallGroups).map(([stallId, list]) => {
              const stall = getStall(stallId)!;
              return (
                <div key={stallId}>
                  <p className="text-sm font-semibold">{stall.cover} {stall.name}</p>
                  <ul className="mt-1 space-y-0.5">
                    {list.map(it => {
                      const p = getProduct(it.productId)!;
                      return <li key={it.productId} className="flex justify-between text-xs text-muted-foreground"><span>{p.name} × {it.qty} {p.unit}</span><span>{formatVnd(p.price * it.qty)}</span></li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-3 space-y-1 border-t pt-2 text-sm">
            <Row label="Tạm tính" value={formatVnd(subtotal)} />
            <Row label="Phí giao hàng" value={formatVnd(deliveryFee)} />
            <Row label="Phí dịch vụ" value={formatVnd(serviceFee)} />
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold">Tổng</span><span className="text-lg font-extrabold text-primary">{formatVnd(total)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3 safe-bottom">
        <button onClick={place} className="h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.98]">
          Đặt đơn · {formatVnd(total)}
        </button>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
