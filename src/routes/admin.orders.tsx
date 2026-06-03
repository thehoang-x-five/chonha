import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin-ui";
import { orders, getMarket, getDriver, getProduct, getStall, formatVnd, drivers, type Order } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { Eye, Search, Phone, MapPin, Undo2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: Page });

const statusFilters = ["all", "confirmed", "preparing", "finding_driver", "picking", "delivering", "completed", "cancelled"] as const;
const labels: Record<string, string> = { all: "Tất cả", confirmed: "Đã xác nhận", preparing: "Đang chuẩn bị", finding_driver: "Tìm tài xế", picking: "Lấy hàng", delivering: "Đang giao", completed: "Hoàn tất", cancelled: "Đã huỷ" };

function Page() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("all");
  const [detail, setDetail] = useState<Order | null>(null);

  const rows = useMemo(() => orders.filter(o => (filter === "all" || o.status === filter) && (o.code.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase()))), [q, filter]);

  return (
    <AdminShell title="Đơn hàng" subtitle={`${orders.length} đơn trong 24h qua`}>
      <SectionCard title="Danh sách đơn" action={
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm mã đơn, khách…" className="w-48 bg-transparent text-sm outline-none" />
        </div>
      }>
        <div className="-mt-2 mb-3 flex flex-wrap gap-2">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{labels[s]}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Mã đơn</th><th className="p-3 text-left">Khách</th><th className="p-3 text-left">Chợ</th><th className="p-3 text-left">Sạp</th><th className="p-3 text-left">Tài xế</th><th className="p-3 text-right">Tổng</th><th className="p-3 text-left">Trạng thái</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(o => {
                const m = getMarket(o.marketId)!;
                const d = getDriver(o.driverId);
                const meta = orderStatusLabel[o.status];
                const stallCount = new Set(o.items.map(i => i.stallId)).size;
                return (
                  <tr key={o.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">#{o.code}</td>
                    <td className="p-3 font-semibold">{o.customer}</td>
                    <td className="p-3 text-muted-foreground">{m.name}</td>
                    <td className="p-3">{stallCount}</td>
                    <td className="p-3 text-muted-foreground">{d?.name ?? "—"}</td>
                    <td className="p-3 text-right font-semibold">{formatVnd(o.total)}</td>
                    <td className="p-3"><StatusBadge variant={meta.variant}>{meta.label}</StatusBadge></td>
                    <td className="p-3"><button onClick={() => setDetail(o)} className="tap-target grid place-items-center rounded-full hover:bg-muted"><Eye className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-sm text-muted-foreground">Không tìm thấy đơn nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (() => {
            const m = getMarket(detail.marketId)!;
            const d = getDriver(detail.driverId);
            const meta = orderStatusLabel[detail.status];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Đơn #{detail.code}</span>
                    <StatusBadge variant={meta.variant}>{meta.label}</StatusBadge>
                  </DialogTitle>
                  <DialogDescription>{m.name} · tạo lúc {new Date(detail.createdAt).toLocaleString("vi-VN")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="rounded-xl border p-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Khách hàng</p>
                    <p className="mt-1 font-semibold">{detail.customer}</p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Phone className="h-3 w-3" />{detail.customerPhone}</p>
                    <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{detail.address}</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Tài xế</p>
                    <p className="mt-1 font-semibold">{d?.name ?? "Chưa gán"}</p>
                    {d && <p className="text-xs text-muted-foreground">{d.vehicle} · {d.plate}</p>}
                  </div>
                  <div className="rounded-xl border">
                    <p className="border-b p-3 text-xs font-bold uppercase text-muted-foreground">Sản phẩm</p>
                    <ul className="divide-y">
                      {detail.items.map((it, i) => {
                        const p = getProduct(it.productId);
                        const s = getStall(it.stallId);
                        return (
                          <li key={i} className="flex items-center justify-between p-3 text-sm">
                            <div className="min-w-0">
                              <p className="truncate font-medium">{p?.image} {p?.name} × {it.qty}</p>
                              <p className="text-xs text-muted-foreground">{s?.name}</p>
                            </div>
                            <span className="font-semibold">{formatVnd((p?.price ?? 0) * it.qty)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3 text-sm">
                    <Row k="Tạm tính" v={formatVnd(detail.subtotal)} />
                    <Row k="Phí giao" v={formatVnd(detail.deliveryFee)} />
                    <Row k="Phí dịch vụ" v={formatVnd(detail.serviceFee)} />
                    <div className="mt-2 flex justify-between border-t pt-2 font-bold"><span>Tổng cộng</span><span className="text-primary">{formatVnd(detail.total)}</span></div>
                  </div>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <select
                    defaultValue=""
                    onChange={async (e) => {
                      const id = e.target.value;
                      if (!id) return;
                      try {
                        await adminService.assignDriver(detail.id, id);
                        const dr = drivers.find((x) => x.id === id);
                        toast.success(`Đã gán ${dr?.name ?? "tài xế"} cho đơn ${detail.code}`);
                        setDetail({ ...detail, driverId: id });
                      } catch (err) { toast.error(err instanceof Error ? err.message : "Gán tài xế thất bại"); }
                    }}
                    className="h-10 rounded-xl border bg-card px-3 text-sm"
                  >
                    <option value="">{detail.driverId ? "Gán tài xế khác" : "Gán tài xế"}…</option>
                    {drivers.filter((d) => d.isOnline).map((d) => (
                      <option key={d.id} value={d.id}>{d.name} · {d.vehicle}</option>
                    ))}
                  </select>
                  <button
                    onClick={async () => {
                      try {
                        await adminService.refund(detail.id);
                        toast.success(`Đã hoàn tiền đơn ${detail.code} (mô phỏng)`);
                        setDetail({ ...detail, paymentStatus: "refunded" });
                      } catch (err) { toast.error(err instanceof Error ? err.message : "Hoàn tiền thất bại"); }
                    }}
                    disabled={detail.paymentStatus === "refunded"}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-bold text-destructive disabled:opacity-50"
                  ><Undo2 className="h-4 w-4" /> {detail.paymentStatus === "refunded" ? "Đã hoàn tiền" : "Hoàn tiền"}</button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>;
}
