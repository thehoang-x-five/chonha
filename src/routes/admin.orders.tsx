import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { orders, getMarket, getDriver, formatVnd } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({ component: Page });

function Page() {
  return (
    <AdminShell title="Đơn hàng">
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="p-3 text-left">Mã đơn</th><th className="p-3 text-left">Khách</th><th className="p-3 text-left">Chợ</th><th className="p-3 text-left">Sạp</th><th className="p-3 text-left">Tài xế</th><th className="p-3 text-left">Tổng</th><th className="p-3 text-left">Trạng thái</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const m = getMarket(o.marketId)!;
              const d = getDriver(o.driverId);
              const meta = orderStatusLabel[o.status];
              const stallCount = new Set(o.items.map(i => i.stallId)).size;
              return (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-mono text-xs">#{o.code}</td>
                  <td className="p-3 font-semibold">{o.customer}</td>
                  <td className="p-3 text-muted-foreground">{m.name}</td>
                  <td className="p-3">{stallCount}</td>
                  <td className="p-3 text-muted-foreground">{d?.name ?? "—"}</td>
                  <td className="p-3 font-semibold">{formatVnd(o.total)}</td>
                  <td className="p-3"><StatusBadge variant={meta.variant}>{meta.label}</StatusBadge></td>
                  <td className="p-3"><button className="tap-target grid place-items-center rounded-full hover:bg-muted"><Eye className="h-4 w-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
