import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard, ScoreBar } from "@/components/admin-ui";
import { MapPlaceholder, EmptyState } from "@/components/cards";
import { getMarket, formatVnd } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { adminService, type DispatchScore } from "@/services/adminService";
import type { Order } from "@/types/order.types";
import type { Driver } from "@/types/delivery.types";
import { Star, Bike, Clock, MapPin, Sparkles, Inbox } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dispatch")({ component: Page });

function Page() {
  const [waiting, setWaiting] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [ranked, setRanked] = useState<Array<{ driver: Driver; score: DispatchScore }>>([]);
  const [matchDriver, setMatchDriver] = useState<{ driver: Driver; score: DispatchScore } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadWaiting = () => adminService.listWaitingOrders().then((rows) => {
    setWaiting(rows);
    setSelectedOrder((cur) => cur && rows.some((r) => r.id === cur) ? cur : rows[0]?.id ?? null);
  });

  useEffect(() => { loadWaiting(); }, []);
  useEffect(() => {
    if (!selectedOrder) { setRanked([]); return; }
    adminService.rankDriversForOrder(selectedOrder).then(setRanked);
  }, [selectedOrder]);

  const order = useMemo(() => waiting.find((o) => o.id === selectedOrder), [waiting, selectedOrder]);

  const reshuffle = async () => {
    if (!selectedOrder) return;
    setRefreshing(true);
    try {
      const rows = await adminService.rankDriversForOrder(selectedOrder);
      setRanked(rows);
      toast.success("Đã mô phỏng lại điểm match");
    } finally { setRefreshing(false); }
  };

  const assign = async (driverId: string, driverName: string) => {
    if (!selectedOrder || !order) return;
    try {
      await adminService.assignDriver(selectedOrder, driverId);
      toast.success(`Đã gán ${driverName} cho đơn ${order.code}`);
      await loadWaiting();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gán tài xế thất bại");
    }
  };

  return (
    <AdminShell title="Điều phối giao hàng" subtitle="Bản đồ thời gian thực">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title={order ? `Đơn đang xem · #${order.code}` : "Bản đồ điều phối"} action={
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-bold text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> {ranked.length} tài xế khả dụng</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 font-bold text-warning-foreground">{waiting.length} đơn chờ</span>
              <button onClick={reshuffle} disabled={refreshing || !selectedOrder} className="rounded-full bg-primary px-3 py-1 font-bold text-primary-foreground disabled:opacity-50">{refreshing ? "Đang mô phỏng…" : "Mô phỏng matching"}</button>
            </div>
          }>
            <MapPlaceholder className="h-72" label="Bản đồ điều phối Quận 7" driver />
          </SectionCard>
        </div>

        <SectionCard title="Thuật toán chấm điểm" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <p className="mb-3 text-xs text-muted-foreground">Điểm match dựa trên 4 yếu tố có trọng số:</p>
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
          <p className="mt-3 rounded-xl bg-muted/50 p-2 text-[11px] text-muted-foreground">* Mô phỏng frontend; giá trị thật sẽ tính từ GPS, lịch sử cuốc và phản hồi khách.</p>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title={`Đơn đang chờ tài xế (${waiting.length})`}>
          {waiting.length === 0 ? (
            <EmptyState icon={Inbox} title="Không có đơn nào đang chờ" description="Khi có đơn cần tài xế, nó sẽ hiện ở đây." />
          ) : (
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
                        <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {o.driverId ? "Cần gán lại" : "Chưa gán"}</span>
                        <span className="font-bold text-primary">{formatVnd(o.total)}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Tài xế khả dụng (xếp hạng theo độ phù hợp)">
          {ranked.length === 0 ? (
            <EmptyState icon={Bike} title="Không có tài xế khả dụng" description="Đang chờ tài xế bật trực tuyến hoặc chọn đơn ở bên trái." />
          ) : (
            <ul className="space-y-2">
              {ranked.map(({ driver: d, score }, idx) => (
                <li key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="relative">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-xl">{d.avatar}</div>
                    {idx === 0 && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-success px-1.5 py-0.5 text-[9px] font-bold text-success-foreground">TOP</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating} · <Bike className="h-3 w-3" /> {d.vehicle} · {score.distanceKm} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-primary leading-none">{score.total}</p>
                    <p className="text-[10px] text-muted-foreground">điểm match</p>
                  </div>
                  <button onClick={() => setMatchDriver({ driver: d, score })} className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-muted">Xem</button>
                  <button onClick={() => assign(d.id, d.name)} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">{order?.driverId ? "Gán lại" : "Gán"}</button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <Dialog open={!!matchDriver} onOpenChange={(o) => !o && setMatchDriver(null)}>
        <DialogContent className="max-w-md">
          {matchDriver && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-xl">{matchDriver.driver.avatar}</div>
                  {matchDriver.driver.name}
                </DialogTitle>
                <DialogDescription>{matchDriver.driver.vehicle} · {matchDriver.driver.plate} · {matchDriver.driver.area}</DialogDescription>
              </DialogHeader>
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Điểm phù hợp</p>
                <p className="text-4xl font-extrabold text-primary">{matchDriver.score.total}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Khoảng cách: {matchDriver.score.distanceKm} km</p>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Khoảng cách đến chợ (40%)" value={matchDriver.score.distance} />
                <ScoreBar label="Cuốc đang xử lý (25%)" value={matchDriver.score.workload} />
                <ScoreBar label="Đánh giá (20%)" value={matchDriver.score.rating} />
                <ScoreBar label="Phù hợp phương tiện (15%)" value={matchDriver.score.vehicle} />
              </div>
              <DialogFooter>
                <button onClick={() => setMatchDriver(null)} className="rounded-xl border px-4 py-2 text-sm font-bold">Đóng</button>
                <button onClick={() => { assign(matchDriver.driver.id, matchDriver.driver.name); setMatchDriver(null); }} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Gán đơn này</button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
