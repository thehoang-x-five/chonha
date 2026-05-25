import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { drivers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Star } from "lucide-react";

export const Route = createFileRoute("/admin/drivers")({ component: Page });

function Page() {
  return (
    <AdminShell title="Tài xế">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {drivers.map(d => (
          <div key={d.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl">{d.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.vehicle} · {d.plate}</p>
              </div>
              <StatusBadge variant={d.online ? "success" : "muted"}>{d.online ? "Online" : "Offline"}</StatusBadge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-2 text-center text-xs">
              <div><p className="font-bold inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating}</p><p className="text-muted-foreground">Đánh giá</p></div>
              <div><p className="font-bold">{d.trips}</p><p className="text-muted-foreground">Cuốc</p></div>
              <div><p className="font-bold">{d.area}</p><p className="text-muted-foreground">Khu vực</p></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-xl border py-2 text-xs font-bold">Xem hồ sơ</button>
              <button className="rounded-xl border border-destructive/30 bg-destructive/5 py-2 text-xs font-bold text-destructive">Tạm khoá</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
