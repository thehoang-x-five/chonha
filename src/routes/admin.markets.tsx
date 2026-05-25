import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/status-badge";
import { markets, getStallsByMarket } from "@/lib/mock-data";
import { MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin/markets")({ component: Page });

function Page() {
  return (
    <AdminShell title="Chợ truyền thống">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="hidden grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-xs font-bold uppercase text-muted-foreground md:grid">
          <div className="col-span-3">Tên chợ</div><div className="col-span-3">Địa chỉ</div><div className="col-span-1">Sạp</div><div className="col-span-2">Đơn hôm nay</div><div className="col-span-2">Trạng thái</div><div className="col-span-1"></div>
        </div>
        {markets.map(m => (
          <div key={m.id} className="grid grid-cols-2 gap-3 border-b p-4 last:border-b-0 md:grid-cols-12 md:items-center">
            <div className="md:col-span-3"><p className="font-bold">{m.cover} {m.name}</p><p className="text-xs text-muted-foreground md:hidden">{m.address}</p></div>
            <div className="hidden text-sm md:col-span-3 md:block">{m.address}</div>
            <div className="md:col-span-1"><span className="text-xs text-muted-foreground md:hidden">Sạp: </span><span className="font-semibold">{getStallsByMarket(m.id).length}</span></div>
            <div className="md:col-span-2"><span className="text-xs text-muted-foreground md:hidden">Đơn: </span><span className="font-semibold">{Math.floor(Math.random() * 80) + 20}</span></div>
            <div className="md:col-span-2"><StatusBadge variant={m.status === "open" ? "success" : m.status === "closing" ? "warning" : "muted"}>{m.status === "open" ? "Mở cửa" : m.status === "closing" ? "Sắp đóng" : "Đóng"}</StatusBadge></div>
            <div className="md:col-span-1 md:text-right"><button className="tap-target grid place-items-center rounded-full hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button></div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
