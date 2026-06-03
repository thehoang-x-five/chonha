import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { MapPlaceholder } from "@/components/cards";
import { orders, getStall, getMarket, getProduct, formatVnd } from "@/lib/mock-data";
import { Phone, MessageCircle, Check, AlertTriangle, Navigation, MapPin, Store, Package, ShieldCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deliveryService } from "@/services/deliveryService";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/driver/trips/$id")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

type Step = "to_market" | "picking" | "to_customer" | "delivered";

function Page() {
  const order = Route.useLoaderData();
  const market = getMarket(order.marketId)!;
  const stallIds = Array.from(new Set<string>(order.items.map((i: any) => i.stallId)));
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [issueOpen, setIssueOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [delivered, setDelivered] = useState(false);

  const allPicked = stallIds.every(id => picked[id]);
  const step: Step = delivered ? "delivered" : allPicked ? "to_customer" : "picking";

  const togglePicked = (sid: string) => {
    setPicked(p => {
      const next = { ...p, [sid]: !p[sid] };
      if (!p[sid]) toast.success(`Đã lấy hàng ${getStall(sid)?.name}`);
      return next;
    });
  };

  const confirmOtp = async () => {
    try {
      await deliveryService.confirmDelivery(order.id, otp);
      setDelivered(true);
      setOtpOpen(false);
      toast.success("Đã giao hàng thành công 🎉");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Mã OTP chưa đúng");
    }
  };

  const reportIssue = async (reason: string) => {
    try { await deliveryService.reportIssue(order.id, reason); }
    catch { /* ignore */ }
    setIssueOpen(false);
    toast.success("Đã gửi báo cáo, tổng đài sẽ gọi bạn");
  };

  return (
    <MobileShell padBottom={false}>
      <AppHeader title={`Cuốc #${order.code}`} back="/driver/trips" right={
        <button onClick={() => setIssueOpen(true)} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
          <AlertTriangle className="h-3.5 w-3.5" /> Báo lỗi
        </button>
      } />

      <div className="px-4 pt-3">
        <MapPlaceholder className="h-44" label={
          step === "picking" ? "Đang dẫn đường tới chợ" :
          step === "to_customer" ? "Đang giao tới khách" :
          "Đã giao xong"
        } driver={step !== "delivered"} />
      </div>

      {/* Timeline */}
      <Timeline step={step} />

      {/* Body by step */}
      {step !== "to_customer" && step !== "delivered" && (
        <PickupSection
          marketName={market.name}
          stallIds={stallIds}
          order={order}
          picked={picked}
          onToggle={togglePicked}
        />
      )}

      {(step === "to_customer" || step === "delivered") && (
        <DeliverSection
          order={order}
          delivered={delivered}
          onOpenOtp={() => setOtpOpen(true)}
        />
      )}

      <div className="h-8" />

      {/* Sticky CTA */}
      {!delivered && (
        <div className="sticky bottom-0 z-30 border-t bg-card/95 px-4 py-3 backdrop-blur safe-bottom">
          {step === "picking" && (
            <button
              disabled={!allPicked}
              onClick={() => toast.success("Bắt đầu giao cho khách")}
              className={`h-14 w-full rounded-2xl text-base font-extrabold transition ${allPicked ? "bg-info text-info-foreground shadow" : "bg-muted text-muted-foreground"}`}
            >
              {allPicked ? (<><Navigation className="mr-1 inline h-5 w-5" /> Bắt đầu giao khách</>) : `Cần lấy ${stallIds.filter(s => !picked[s]).length} sạp nữa`}
            </button>
          )}
          {step === "to_customer" && (
            <button onClick={() => setOtpOpen(true)} className="h-14 w-full rounded-2xl bg-success text-base font-extrabold text-success-foreground shadow">
              <ShieldCheck className="mr-1 inline h-5 w-5" /> Xác nhận giao bằng OTP
            </button>
          )}
        </div>
      )}

      {delivered && (
        <div className="mx-4 my-4 rounded-2xl border-2 border-success bg-success/10 p-4 text-center">
          <CheckBig />
          <p className="mt-2 text-lg font-extrabold text-success">Đã giao hàng thành công</p>
          <p className="text-xs text-muted-foreground">Thu nhập +{formatVnd(32000)} đã cộng vào ví</p>
          <Link to="/driver/trips" className="mt-3 inline-block rounded-full bg-success px-5 py-2 text-sm font-bold text-success-foreground">Về danh sách cuốc</Link>
        </div>
      )}

      {/* Issue dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo sự cố</DialogTitle>
            <DialogDescription>Chọn loại sự cố bạn đang gặp. Tổng đài sẽ liên hệ hỗ trợ ngay.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { label: "Khách không nghe máy", desc: "Đã gọi nhiều lần không ai bắt máy" },
              { label: "Gian hàng chưa chuẩn bị xong", desc: "Sạp chưa có hàng để giao" },
              { label: "Không tìm thấy địa chỉ", desc: "Địa chỉ giao hàng không chính xác" },
              { label: "Sự cố khác", desc: "Mô tả với tổng đài" },
            ].map(i => (
              <button key={i.label} onClick={() => reportIssue(i.label)} className="flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition hover:bg-accent">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold">{i.label}</p>
                  <p className="text-xs text-muted-foreground">{i.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setIssueOpen(false)} className="rounded-full border px-4 py-2 text-sm font-semibold">Đóng</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận giao hàng</DialogTitle>
            <DialogDescription>Yêu cầu khách đọc mã OTP 4 số trong ứng dụng để hoàn tất cuốc.</DialogDescription>
          </DialogHeader>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="• • • •"
            inputMode="numeric"
            className="h-16 w-full rounded-2xl border-2 border-primary/30 bg-background text-center text-3xl font-extrabold tracking-[0.5em] outline-none focus:border-primary"
          />
          <p className="text-center text-xs text-muted-foreground">Khách có thể tìm mã ở mục “Đơn hàng đang giao”.</p>
          <DialogFooter>
            <button onClick={() => setOtpOpen(false)} className="rounded-full border px-4 py-2 text-sm font-semibold">Huỷ</button>
            <button onClick={confirmOtp} className="rounded-full bg-success px-5 py-2 text-sm font-bold text-success-foreground">Xác nhận</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}

function Timeline({ step }: { step: Step }) {
  const steps = [
    { key: "to_market", label: "Đi đến chợ", icon: Navigation },
    { key: "picking", label: "Lấy hàng", icon: Store },
    { key: "to_customer", label: "Giao khách", icon: Package },
    { key: "delivered", label: "Hoàn tất", icon: Check },
  ] as const;
  const order = ["to_market","picking","to_customer","delivered"];
  const idx = order.indexOf(step);
  return (
    <div className="mx-4 mt-3 rounded-2xl border bg-card p-3">
      <ol className="flex items-center justify-between">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          const Icon = s.icon;
          return (
            <li key={s.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`mt-1 text-[10px] font-semibold ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`mx-1 mt-[-14px] h-0.5 flex-1 ${i < idx ? "bg-success" : "bg-border"}`} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PickupSection({ marketName, stallIds, order, picked, onToggle }: any) {
  const totalPicked = stallIds.filter((s: string) => picked[s]).length;
  return (
    <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Lấy hàng tại {marketName}</p>
          <p className="text-xs text-muted-foreground">{totalPicked}/{stallIds.length} sạp đã lấy xong</p>
        </div>
        <a href="tel:0900000" className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"><Phone className="h-3.5 w-3.5" />Gọi BQL chợ</a>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(totalPicked / stallIds.length) * 100}%` }} />
      </div>

      <ul className="mt-3 space-y-2">
        {stallIds.map((sid: string) => {
          const s = getStall(sid)!;
          const stallItems = order.items.filter((i: any) => i.stallId === sid);
          const done = picked[sid];
          return (
            <li key={sid} className={`rounded-2xl border p-3 transition ${done ? "border-success/50 bg-success/5" : "bg-card"}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-2xl">{s.cover}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{stallItems.length} mặt hàng</p>
                </div>
                <a href="tel:0900000" className="tap-target grid h-9 w-9 place-items-center rounded-full border bg-card"><Phone className="h-4 w-4" /></a>
              </div>
              <ul className="mt-2 space-y-1 rounded-xl bg-muted/40 p-2 text-sm">
                {stallItems.map((it: any) => {
                  const p = getProduct(it.productId);
                  return (
                    <li key={it.productId} className="flex items-center justify-between">
                      <span className="truncate">{p?.image} {p?.name}</span>
                      <span className="font-semibold">×{it.qty} {p?.unit}</span>
                    </li>
                  );
                })}
              </ul>
              <button onClick={() => onToggle(sid)} className={`mt-2 h-12 w-full rounded-xl text-sm font-bold transition ${done ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}`}>
                {done ? <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> Đã lấy hàng</span> : "Xác nhận đã lấy"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DeliverSection({ order, delivered, onOpenOtp }: any) {
  return (
    <div className="mx-4 mt-3 space-y-3">
      <div className="rounded-2xl border-2 border-info/40 bg-info/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-info">Giao đến khách hàng</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-card text-2xl">👤</div>
          <div className="flex-1">
            <p className="font-bold">{order.customer}</p>
            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
          </div>
        </div>
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-card p-2.5 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
          <p className="flex-1">{order.address}</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <a href={`tel:${order.customerPhone}`} className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"><Phone className="h-4 w-4" /> Gọi khách</a>
          <button onClick={() => notifyTodo("Nhắn tin khách")} className="flex items-center justify-center gap-1.5 rounded-2xl border bg-card py-3 text-sm font-bold"><MessageCircle className="h-4 w-4" /> Nhắn tin</button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <p className="text-sm font-bold">Tóm tắt đơn</p>
        <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Tổng tiền hàng</span><span className="font-semibold">{formatVnd(order.subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phí ship khách trả</span><span className="font-semibold">{formatVnd(order.deliveryFee)}</span></div>
        <div className="mt-2 border-t pt-2 flex justify-between"><span className="font-bold">Thu hộ (COD)</span><span className="font-extrabold text-primary">{formatVnd(order.total)}</span></div>
      </div>
    </div>
  );
}

function CheckBig() {
  return (
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground">
      <Check className="h-8 w-8" strokeWidth={3} />
    </div>
  );
}
