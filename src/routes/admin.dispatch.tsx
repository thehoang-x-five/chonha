import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard, ScoreBar } from "@/components/admin-ui";
import { MapPlaceholder } from "@/components/cards";
import { drivers, orders, getMarket, formatVnd, getDriver } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { Star, Bike, Clock, MapPin, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dispatch")({ component: Page });

function score(d: typeof drivers[number], distance: number) {
  // distance 40, workload 25, rating 20, vehicle 15
  const distScore = Math.max(0, 100 - distance * 18);
  const workload = Math.max(20, 100 - (d.trips % 5) * 10);
  const rating = (d.rating / 5) * 100;
  const vehicle = d.vehicle.toLowerCase().includes("lead") || d.vehicle.toLowerCase().includes("wave") ? 95 : 80;
  const total = distScore * 0.4 + workload * 0.25 + rating * 0.2 + vehicle * 0.15;
  return { distScore, workload, rating, vehicle, total: Math.round(total) };
}

function Page() {
  const waiting = orders.filter(o => o.status === "finding_driver" || o.status === "confirmed");
  const available = drivers.filter(d => d.online);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(waiting[0]?.id ?? null);
  const [matchDriver, setMatchDriver] = useState<typeof drivers[number] | null>(null);
  const order = orders.find(o => o.id === selectedOrder);

  const ranked = useMemo(() => {
    return available
      .map(d => ({ d, ...score(d, Math.abs(d.id.charCodeAt(1) - 100) / 30 + 1) }))
      .sort((a, b) => b.total - a.total);
  }, [available]);

  return (
    <AdminShell title="Điều phối giao hàng" subtitle="Bản đồ thời gian thực">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title={order ? `Đơn đang xem · #${order.code}` : "Bản đồ điều phối"} action={
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-bold text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> {available.length} tài xế online</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 font-bold text-warning-foreground">{waiting.length} đơn chờ</span>
            </div>
          }>
            <MapPlaceholder className="h-72" label="Bản đồ điều phối Quận 7" driver />
          </SectionCard>
        </div>

        <SectionCard title="Thuật toán chấm điểm" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <p className="mb-3 text-xs text-muted-foreground">Tài xế phù hợp nhất sẽ được đề xuất tự động dựa trên 4 yếu tố:</p>
          <ul className="space-y-2.5">
            {[
              { l: "Khoảng cách đến chợ", w: "40%", c: "bg-primary" },
              { l: "Cuốc đang xử lý", w: "25%", c: "bg-info" },
              { l: "Đánh giá tài xế", w: "20%", c: "bg-success" },
              { l: "Phù hợp phương tiện", w: "15%", c: "bg-warning" },
            ].map((s) => (
              <li key={s.l}>
                <div className="flex justify-between text-xs"><span className="font-medium">{s.l}</span><span className="font-bold">{s.w}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${s.c}`} style={{ width: s.w }} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-muted/50 p-2 text-[11px] text-muted-foreground">* Mô phỏng frontend; giá trị thật tính từ GPS, lịch sử cuốc và phản hồi khách.</p>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title={`Đơn đang chờ tài xế (${waiting.length})`}>
          <ul className="space-y-2">
            {waiting.map(o => {
              const m = getMarket(o.marketId)!;
              const meta = orderStatusLabel[o.status];
              const active = o.id === selectedOrder;
              return (
                <li key={o.id}>
                  <button onClick={() => setSelectedOrder(o.id)} className={`w-full rounded-xl border p-3 text-left transition ${active ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">#{o.code}</p>
                      <StatusBadge variant={meta.variant}>{meta.label}</StatusBadge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />{m.name} → {o.address}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> chờ 4 phút</span>
                      <span className="font-bold text-primary">{formatVnd(o.total)}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Tài xế khả dụng (xếp hạng theo độ phù hợp)">
          <ul className="space-y-2">
            {ranked.map(({ d, total }, idx) => (
              <li key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-xl">{d.avatar}</div>
                  {idx === 0 && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-success px-1.5 py-0.5 text-[9px] font-bold text-success-foreground">TOP</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating} · <Bike className="h-3 w-3" /> {d.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-primary leading-none">{total}</p>
                  <p className="text-[10px] text-muted-foreground">điểm match</p>
                </div>
                <button onClick={() => setMatchDriver(d)} className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-muted">Xem</button>
                <button onClick={() => { toast.success(`Đã gán ${d.name} cho đơn ${order?.code ?? ""}`); }} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Gán</button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Dialog open={!!matchDriver} onOpenChange={(o) => !o && setMatchDriver(null)}>
        <DialogContent className="max-w-md">
          {matchDriver && (() => {
            const s = score(matchDriver, 1.5);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xl">{matchDriver.avatar}</div>
                    {matchDriver.name}
                  </DialogTitle>
                  <DialogDescription>{matchDriver.vehicle} · {matchDriver.plate} · {matchDriver.area}</DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Điểm phù hợp</p>
                  <p className="text-4xl font-extrabold text-primary">{s.total}</p>
                </div>
                <div className="space-y-3">
                  <ScoreBar label="Khoảng cách đến chợ (40%)" value={Math.round(s.distScore)} />
                  <ScoreBar label="Cuốc đang xử lý (25%)" value={Math.round(s.workload)} />
                  <ScoreBar label="Đánh giá (20%)" value={Math.round(s.rating)} />
                  <ScoreBar label="Phù hợp phương tiện (15%)" value={Math.round(s.vehicle)} />
                </div>
                <DialogFooter>
                  <button onClick={() => setMatchDriver(null)} className="rounded-xl border px-4 py-2 text-sm font-bold">Đóng</button>
                  <button onClick={() => { toast.success(`Đã gán ${matchDriver.name}`); setMatchDriver(null); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Gán đơn này</button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
