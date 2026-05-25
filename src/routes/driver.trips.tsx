import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { formatVnd } from "@/lib/mock-data";
import { MapPin, Navigation, Package } from "lucide-react";

export const Route = createFileRoute("/driver/trips")({ component: Page });

function Page() {
  const [show, setShow] = useState(true);
  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Cuốc giao" />
      <div className="px-4 pt-3 space-y-3">
        {show && (
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Cuốc mới</span>
              <span className="text-xs font-bold text-secondary">15s</span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-success" /><div><p className="font-bold">Lấy tại Chợ Tân Mỹ</p><p className="text-xs text-muted-foreground">Cách bạn 0.8 km · 3 gian hàng</p></div></div>
              <div className="flex items-start gap-2"><Navigation className="mt-0.5 h-4 w-4 text-info" /><div><p className="font-bold">Giao tới Sunrise City, Q.7</p><p className="text-xs text-muted-foreground">Tổng quãng đường 3.5 km</p></div></div>
            </div>
            <div className="mt-3 rounded-xl bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Thu nhập dự kiến</p>
              <p className="text-2xl font-extrabold text-primary">{formatVnd(32000)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/driver/trips/$id" params={{ id: "o4" }} onClick={() => setShow(false)} className="rounded-2xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground">Nhận cuốc</Link>
              <button onClick={() => setShow(false)} className="rounded-2xl border bg-card py-3 text-sm font-bold">Bỏ qua</button>
            </div>
          </div>
        )}

        <p className="pt-2 text-sm font-bold">Cuốc đang chạy</p>
        <Link to="/driver/trips/$id" params={{ id: "o1" }} className="block rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><Package className="h-6 w-6" /></div>
            <div className="flex-1">
              <p className="font-bold">Đơn #CNM-2410001</p>
              <p className="text-xs text-muted-foreground">3 sạp · Chợ Tân Mỹ → Q.7</p>
            </div>
            <span className="rounded-full bg-info/15 px-2.5 py-1 text-xs font-bold text-info">Đang lấy</span>
          </div>
        </Link>
      </div>
    </MobileShell>
  );
}
