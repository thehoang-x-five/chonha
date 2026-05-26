import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Wallet, Banknote, Building2, Pencil, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { useCart, cart } from "@/lib/cart-store";
import { formatVnd, getMarket, getStall, getProduct } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/customer/checkout")({ component: Page });

const FREE_SHIP = 200000;

const times = [
  { id: "asap", label: "Giao sớm nhất", hint: "≈ 35 phút", emoji: "⚡" },
  { id: "60", label: "Trong 60 phút", hint: "Linh hoạt", emoji: "⏱️" },
  { id: "schedule", label: "Hẹn 17:30 hôm nay", hint: "Đặt giờ", emoji: "📅" },
];
const pays = [
  { id: "cash", label: "Tiền mặt khi nhận", hint: "Phổ biến nhất", icon: Banknote },
  { id: "bank", label: "Chuyển khoản", hint: "VietQR · Vietcombank", icon: Building2 },
  { id: "wallet", label: "Ví Momo / ZaloPay", hint: "Demo", icon: Wallet },
];

function Page() {
  const { items, subtotal, stallGroups, marketId } = useCart();
  const market = marketId ? getMarket(marketId) : null;
  const nav = useNavigate();
  const [time, setTime] = useState("asap");
  const [pay, setPay] = useState("cash");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);

  if (items.length === 0) {
    nav({ to: "/customer/cart" });
    return null;
  }

  const deliveryFeeBase = market?.deliveryFeeFrom ?? 18000;
  const deliveryFee = subtotal >= FREE_SHIP ? 0 : deliveryFeeBase;
  const serviceFee = 5000;
  const total = subtotal + deliveryFee + serviceFee;
  const stallCount = Object.keys(stallGroups).length;

  const place = () => {
    setConfirm(false);
    toast.success("Đặt hàng thành công!", { description: `Đơn từ ${market?.name} đang được các sạp chuẩn bị.` });
    cart.clear();
    nav({ to: "/customer/orders/$id/tracking", params: { id: "o5" } });
  };

  return (
    <MobileShell padBottom={false}>
      <AppHeader title="Xác nhận đơn" back="/customer/cart" />
      <div className="space-y-3 px-4 pb-36 pt-3">
        {/* Address */}
        <section className="rounded-2xl border bg-card p-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><MapPin className="h-4 w-4" /></div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Giao đến</p>
              <p className="text-sm font-bold">Chị Mai · 0909 123 456</p>
              <p className="text-xs text-muted-foreground">112 Nguyễn Thị Thập, P. Tân Phú, Q.7, TP.HCM</p>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-bold text-primary"><Pencil className="h-3 w-3" /> Đổi</button>
          </div>
        </section>

        {/* Time */}
        <section className="rounded-2xl border bg-card p-3 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Thời gian giao</p>
          <div className="grid grid-cols-3 gap-2">
            {times.map(t => (
              <button key={t.id} onClick={() => setTime(t.id)} className={`flex flex-col items-center gap-0.5 rounded-2xl border p-2.5 text-center transition ${time === t.id ? "border-primary bg-primary/10" : "bg-background"}`}>
                <span className="text-xl">{t.emoji}</span>
                <span className="text-[11px] font-bold leading-tight">{t.label}</span>
                <span className="text-[10px] text-muted-foreground">{t.hint}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border bg-card p-3 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Thanh toán</p>
          <div className="space-y-2">
            {pays.map(p => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${pay === p.id ? "border-primary bg-primary/5" : ""}`}>
                <input type="radio" checked={pay === p.id} onChange={() => setPay(p.id)} className="h-4 w-4 accent-[color:var(--primary)]" />
                <p.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-[11px] text-muted-foreground">{p.hint}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="rounded-2xl border bg-card p-3 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Ghi chú cho tài xế</p>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Ví dụ: gọi trước khi đến, gửi bảo vệ tầng 1…" className="w-full rounded-xl border bg-background p-2.5 text-sm outline-none focus:border-primary" />
        </section>

        {/* Order summary */}
        <section className="rounded-2xl border bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Đơn tại {market?.name}</p>
            <span className="text-[11px] text-muted-foreground">{stallCount} sạp · {items.length} món</span>
          </div>
          <div className="space-y-3">
            {Object.entries(stallGroups).map(([stallId, list]) => {
              const stall = getStall(stallId)!;
              return (
                <div key={stallId} className="rounded-xl bg-muted/40 p-2.5">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <span className="text-lg">{stall.avatar}</span>{stall.name}
                  </p>
                  <ul className="mt-1.5 space-y-0.5 pl-1">
                    {list.map(it => {
                      const p = getProduct(it.productId)!;
                      return (
                        <li key={it.productId} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{p.name} · {it.qty} {p.unit}{it.prep ? ` · ${it.prep}` : ""}</span>
                          <span className="font-semibold">{formatVnd(p.price * it.qty)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-3 space-y-1 border-t pt-2 text-sm">
            <Row label="Tạm tính" value={formatVnd(subtotal)} />
            <Row label="Phí giao hàng" value={deliveryFee === 0 ? "Miễn phí" : formatVnd(deliveryFee)} accent={deliveryFee === 0 ? "success" : undefined} />
            <Row label="Phí dịch vụ" value={formatVnd(serviceFee)} />
            <div className="mt-1 flex items-center justify-between border-t pt-2">
              <span className="font-bold">Tổng</span>
              <span className="text-xl font-extrabold text-primary">{formatVnd(total)}</span>
            </div>
          </div>
        </section>

        <div className="flex items-start gap-2 rounded-2xl border bg-success/10 p-3 text-xs">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
          <p><span className="font-bold">Cam kết chợ tươi:</span> Hoàn tiền 100% nếu sản phẩm không tươi hoặc bị hỏng khi nhận.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <button onClick={() => setConfirm(true)} className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-base font-extrabold text-primary-foreground active:scale-[0.98]">
          <span>Đặt đơn ngay</span>
          <span>{formatVnd(total)}</span>
        </button>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-secondary" />Xác nhận đặt đơn?</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn <b>{formatVnd(total)}</b> từ {stallCount} sạp tại {market?.name} sẽ được các cô chú chuẩn bị ngay khi bạn xác nhận.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Xem lại</AlertDialogCancel>
            <AlertDialogAction onClick={place}>Đặt đơn</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "success" }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className={`font-semibold ${accent === "success" ? "text-success" : ""}`}>{value}</span></div>;
}
