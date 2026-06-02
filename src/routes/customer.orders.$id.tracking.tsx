import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Phone, MessageCircle, RotateCcw, HelpCircle, Check, Clock, X, Store, ShieldCheck } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { OrderTimeline } from "@/components/order-timeline";
import { MapPlaceholder } from "@/components/cards";
import { orders, getDriver, getStall, getMarket, getProduct, formatVnd, type Order } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/customer/orders/$id/tracking")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

const flow: Order["status"][] = ["confirmed","preparing","finding_driver","picking","delivering","completed"];
const etaByStatus: Record<Order["status"], string> = {
  pending: "≈ 50 phút",
  confirmed: "≈ 45 phút",
  preparing: "≈ 35 phút",
  ready_for_pickup: "≈ 30 phút",
  finding_driver: "≈ 30 phút",
  driver_assigned: "≈ 25 phút",
  picking: "≈ 20 phút",
  picking_up: "≈ 18 phút",
  delivering: "≈ 8 phút",
  completed: "Đã giao",
  cancelled: "Đã huỷ",
};

function Page() {
  const initial = Route.useLoaderData();
  const [status, setStatus] = useState<Order["status"]>(initial.status);
  const [cancelOpen, setCancelOpen] = useState(false);
  const driver = getDriver(initial.driverId) || getDriver("d1")!;
  const market = getMarket(initial.marketId)!;

  useEffect(() => {
    if (status === "completed" || status === "cancelled") return;
    const t = setTimeout(() => {
      const i = flow.indexOf(status);
      if (i >= 0 && i < flow.length - 1) {
        const next = flow[i + 1];
        setStatus(next);
        if (next === "delivering") toast.success("Tài xế đã lấy đủ hàng, đang trên đường giao!");
        if (next === "completed") toast.success("Đơn hàng đã giao thành công 🎉");
      }
    }, 4500);
    return () => clearTimeout(t);
  }, [status]);

  const stallIds = Array.from(new Set<string>(initial.items.map((i: any) => i.stallId)));
  const pickedCount = status === "picking" ? Math.min(1, stallIds.length) :
    (status === "delivering" || status === "completed") ? stallIds.length : 0;

  const showDriver = ["picking","delivering","completed"].includes(status);
  const showMapDriver = ["picking","delivering"].includes(status);
  const canCancel = ["confirmed","preparing"].includes(status);

  return (
    <MobileShell>
      <AppHeader title="Theo dõi đơn" back="/customer/orders" subtitle={`#${initial.code} · ${etaByStatus[status]}`} />

      {/* Status banner */}
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Trạng thái hiện tại</p>
        <p className="mt-0.5 text-base font-extrabold">
          {status === "confirmed" && "Đã ghi nhận đơn của bạn"}
          {status === "preparing" && "Các sạp đang chuẩn bị hàng tươi"}
          {status === "finding_driver" && "Đang tìm tài xế gần chợ"}
          {status === "picking" && "Tài xế đang lấy hàng tại chợ"}
          {status === "delivering" && "Tài xế đang trên đường đến bạn"}
          {status === "completed" && "Đã giao thành công, chúc bạn ngon miệng!"}
          {status === "cancelled" && "Đơn đã huỷ"}
        </p>
      </div>

      <div className="px-4 pt-3">
        <MapPlaceholder className="h-56" driver={showMapDriver} label={
          status === "delivering" ? `${driver.name} · ${driver.plate}` :
          status === "picking" ? `Đang tại ${market.name}` :
          "Chuẩn bị tại chợ"
        } />
      </div>

      {/* Driver card */}
      {showDriver && (
        <div className="mx-4 mt-3 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-3">
            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl">{driver.avatar}</div>
              <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-success text-[10px] font-bold text-success-foreground ring-2 ring-card">✓</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-tight">{driver.name}</p>
              <p className="text-[11px] text-muted-foreground">⭐ {driver.rating} · {driver.trips} chuyến · {driver.vehicle}</p>
              <p className="mt-0.5 inline-block rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold tracking-wide">{driver.plate}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <a href={`tel:${driver.phone}`} className="tap-target grid place-items-center rounded-full bg-primary text-primary-foreground shadow"><Phone className="h-4 w-4" /></a>
              <button className="tap-target grid place-items-center rounded-full border bg-card"><MessageCircle className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t bg-info/10 px-3 py-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-info"><Clock className="h-3 w-3" /> Dự kiến tới: {etaByStatus[status]}</span>
            <span className="text-muted-foreground">Khoảng cách: 1.4 km</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Hành trình đơn hàng</p>
        <OrderTimeline current={status} />
      </div>

      {/* Pickup checklist */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Store className="h-3.5 w-3.5" />Lấy hàng tại {market.name}</p>
          <span className="text-[11px] font-semibold text-muted-foreground">{pickedCount}/{stallIds.length} sạp</span>
        </div>
        <ul className="space-y-2.5">
          {stallIds.map((sid, i) => {
            const s = getStall(sid)!;
            const picked = i < pickedCount;
            const active = i === pickedCount && status === "picking";
            return (
              <li key={sid} className={`flex items-center gap-3 rounded-xl border p-2.5 ${active ? "border-primary bg-primary/5" : ""}`}>
                <div className={`grid h-9 w-9 place-items-center rounded-full text-base ${picked ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {picked ? <Check className="h-4 w-4" /> : s.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {picked ? "Đã nhận hàng" : active ? "Tài xế đang lấy hàng…" : "Chờ tài xế đến"}
                  </p>
                </div>
                {picked && <span className="text-[11px] font-bold text-success">Xong</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Order items */}
      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Chi tiết đơn</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {initial.items.map((it: any) => {
            const p = getProduct(it.productId)!;
            return (
              <li key={it.productId} className="flex justify-between gap-2">
                <span className="min-w-0 truncate"><span className="mr-1">{p.image}</span>{p.name} × {it.qty} {p.unit}</span>
                <span className="font-semibold">{formatVnd(p.price * it.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t pt-2">
          <span className="text-sm font-bold">Tổng cộng</span>
          <span className="text-xl font-extrabold text-primary">{formatVnd(initial.total)}</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
          <ShieldCheck className="h-3 w-3" /> Đảm bảo chợ tươi · Hoàn tiền nếu không tươi
        </div>
      </div>

      <div className="m-4 grid grid-cols-3 gap-2 pb-8">
        <Link to="/customer/home" className="flex flex-col items-center justify-center gap-1 rounded-2xl border bg-card py-3 text-[11px] font-semibold"><RotateCcw className="h-4 w-4" />Đặt lại</Link>
        <button className="flex flex-col items-center justify-center gap-1 rounded-2xl border bg-card py-3 text-[11px] font-semibold"><HelpCircle className="h-4 w-4" />Hỗ trợ</button>
        <button
          disabled={!canCancel}
          onClick={() => setCancelOpen(true)}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border py-3 text-[11px] font-semibold text-destructive disabled:opacity-40"
        ><X className="h-4 w-4" />Huỷ đơn</button>
      </div>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Huỷ đơn #{initial.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              Các cô chú ngoài chợ có thể đã bắt đầu chuẩn bị hàng. Bạn chỉ có thể huỷ miễn phí trước khi tài xế nhận đơn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setStatus("cancelled"); setCancelOpen(false); toast.success("Đơn hàng đã được huỷ"); }}>
              Xác nhận huỷ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}
