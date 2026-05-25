import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { MapPlaceholder, KPIStatCard } from "@/components/cards";
import { formatVnd } from "@/lib/mock-data";
import { MapPin, Zap } from "lucide-react";

export const Route = createFileRoute("/driver/home")({ component: Page });

function Page() {
  const [online, setOnline] = useState(true);
  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Tài xế Hùng" subtitle="Quận 7, TP.HCM" right={
        <button onClick={() => setOnline(o => !o)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${online ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
          <span className={`h-2 w-2 rounded-full ${online ? "bg-white" : "bg-muted-foreground"}`} />{online ? "Online" : "Offline"}
        </button>
      } />

      <div className="px-4 pt-3">
        <MapPlaceholder className="h-56" label="Khu vực đang hoạt động" />
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <KPIStatCard label="Thu nhập hôm nay" value={formatVnd(285000)} accent="primary" />
        <KPIStatCard label="Cuốc đã giao" value="8" accent="info" hint="Hôm nay" />
      </div>

      <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl border border-success/40 bg-success/10 p-4">
        <Zap className="mt-0.5 h-6 w-6 text-success" />
        <div className="flex-1">
          <p className="font-bold">{online ? "Bạn đang sẵn sàng nhận cuốc" : "Bạn đang ngoại tuyến"}</p>
          <p className="text-xs text-muted-foreground">{online ? "Hệ thống sẽ thông báo khi có cuốc mới gần bạn." : "Bật online để nhận cuốc giao mới."}</p>
        </div>
      </div>

      <div className="mx-4 my-4">
        <Link to="/driver/trips" className="block rounded-2xl bg-primary p-4 text-center text-base font-bold text-primary-foreground">Xem cuốc đang chạy</Link>
      </div>
    </MobileShell>
  );
}
