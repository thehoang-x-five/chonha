import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { MapPlaceholder, KPIStatCard } from "@/components/cards";
import { formatVnd, getMarket } from "@/lib/mock-data";
import { Zap, MapPin, Navigation, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { deliveryService } from "@/services/deliveryService";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Order } from "@/types/order.types";

export const Route = createFileRoute("/driver/home")({ component: Page });

const DRIVER_ID = "d1";

function Page() {
  const [online, setOnline] = useState<boolean>(() => loadJSON<boolean>(STORAGE_KEYS.driverOnline, true));
  const [incoming, setIncoming] = useState<Order | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => { saveJSON(STORAGE_KEYS.driverOnline, online); }, [online]);

  useEffect(() => {
    if (!online) { setIncoming(null); return; }
    const t = setTimeout(async () => {
      try { const o = await deliveryService.getAvailableTripForDriver(DRIVER_ID); setIncoming(o); }
      catch { /* ignore */ }
    }, 1200);
    return () => clearTimeout(t);
  }, [online]);

  useEffect(() => {
    if (!incoming) { setCountdown(15); return; }
    if (countdown <= 0) { setIncoming(null); toast.error("Đã bỏ lỡ cuốc giao"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [incoming, countdown]);

  const accept = async () => {
    if (!incoming) return;
    setBusy(true);
    try {
      await deliveryService.acceptTrip(DRIVER_ID, incoming.id);
      toast.success("Đã nhận cuốc, bắt đầu đi đến chợ");
      const id = incoming.id;
      setIncoming(null);
      nav({ to: "/driver/trips/$id", params: { id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không nhận được cuốc");
    } finally { setBusy(false); }
  };

  const decline = async () => {
    if (!incoming) return;
    try { await deliveryService.declineTrip(incoming.id, DRIVER_ID); } catch { /* ignore */ }
    toast("Đã bỏ qua cuốc");
    setIncoming(null);
  };

  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Anh Hùng" subtitle="Quận 7, TP.HCM" right={
        <button
          onClick={() => { setOnline(o => !o); toast.success(online ? "Đã chuyển sang offline" : "Bạn đã sẵn sàng nhận cuốc"); }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${online ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <span className={`h-2 w-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-muted-foreground"}`} />
          {online ? "Online" : "Offline"}
        </button>
      } />

      <div className="px-4 pt-3">
        <MapPlaceholder className="h-52" label={online ? "Đang tìm cuốc gần bạn..." : "Bật online để bắt đầu"} driver={online} />
      </div>

      {/* Big online toggle banner */}
      <div className="mx-4 mt-3">
        <button
          onClick={() => setOnline(o => !o)}
          className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${online ? "border-success bg-success/10" : "border-dashed border-muted-foreground/40 bg-card"}`}
        >
          <div className={`grid h-12 w-12 place-items-center rounded-full ${online ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold">{online ? "Bạn đang nhận cuốc" : "Bạn đang offline"}</p>
            <p className="text-xs text-muted-foreground">{online ? "Chạm để tạm ngừng nhận cuốc mới" : "Chạm để bắt đầu nhận cuốc"}</p>
          </div>
          <span className={`relative h-7 w-12 rounded-full transition ${online ? "bg-success" : "bg-muted"}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${online ? "left-6" : "left-1"}`} />
          </span>
        </button>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <KPIStatCard label="Thu nhập hôm nay" value={formatVnd(285000)} accent="primary" hint="8 cuốc" />
        <KPIStatCard label="Đánh giá" value="4.9 ★" accent="warning" hint="30 ngày gần nhất" />
      </div>

      <div className="mx-4 mt-3 rounded-2xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Thưởng tuần</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary"><TrendingUp className="h-3 w-3" />+{formatVnd(45000)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-secondary" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Hoàn thành 38/50 cuốc · Còn 12 cuốc để nhận thưởng {formatVnd(100000)}</p>
      </div>

      <div className="mx-4 my-4">
        <Link to="/driver/trips" className="block rounded-2xl bg-primary p-4 text-center text-base font-bold text-primary-foreground shadow-sm">
          Xem cuốc đang chạy
        </Link>
      </div>

      {/* Incoming request modal */}
      {incoming && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-foreground/40 backdrop-blur-sm sm:place-items-center">
          <div className="mx-auto w-full max-w-md animate-in slide-in-from-bottom rounded-t-3xl bg-card p-4 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Cuốc mới
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full border-4 border-primary text-base font-extrabold text-primary">{countdown}</span>
            </div>

            <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">Thu nhập dự kiến</p>
              <p className="text-3xl font-extrabold text-primary">{formatVnd(32000)}</p>
              <p className="text-[11px] text-muted-foreground">Khoảng cách 3.5 km · 3 sạp · ~25 phút</p>
            </div>

            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2 rounded-xl border bg-card p-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-success" />
                <div className="flex-1">
                  <p className="font-bold">Chợ Tân Mỹ</p>
                  <p className="text-xs text-muted-foreground">Cách bạn 0.8 km · 3 gian hàng cần lấy</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl border bg-card p-2.5">
                <Navigation className="mt-0.5 h-4 w-4 text-info" />
                <div className="flex-1">
                  <p className="font-bold">Sunrise City, Q.7</p>
                  <p className="text-xs text-muted-foreground">Giao tận nhà · 2.7 km từ chợ</p>
                </div>
              </li>
            </ul>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => { setIncoming(false); toast("Đã bỏ qua cuốc"); }} className="rounded-2xl border bg-card py-3 text-sm font-bold">Bỏ qua</button>
              <Link
                to="/driver/trips/$id" params={{ id: "o4" }}
                onClick={() => { setIncoming(false); toast.success("Đã nhận cuốc, bắt đầu đi đến chợ"); }}
                className="col-span-2 rounded-2xl bg-primary py-3 text-center text-sm font-extrabold text-primary-foreground shadow"
              >
                Nhận cuốc · {countdown}s
              </Link>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
