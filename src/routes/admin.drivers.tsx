import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin-ui";
import { drivers, type Driver } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Star, Search, Eye, FileText, Phone, Check, X, Bike } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/drivers")({ component: Page });

type VerifyStatus = "verified" | "pending" | "expired";
const enriched = drivers.map((d, i) => ({ ...d, verify: (i === 1 ? "pending" : i === 4 ? "expired" : "verified") as VerifyStatus }));

function Page() {
  const [tab, setTab] = useState<"all" | "online" | "pending">("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<typeof enriched[number] | null>(null);

  const counts = useMemo(() => ({
    all: enriched.length,
    online: enriched.filter(d => d.online).length,
    pending: enriched.filter(d => d.verify !== "verified").length,
  }), []);

  const rows = enriched.filter(d =>
    (tab === "all" || (tab === "online" && d.online) || (tab === "pending" && d.verify !== "verified")) &&
    (d.name.toLowerCase().includes(q.toLowerCase()) || d.plate.toLowerCase().includes(q.toLowerCase()))
  );

  const approve = (d: Driver) => { toast.success(`Đã xác minh ${d.name}`); setDetail(null); };
  const reject = (d: Driver) => { toast.error(`Yêu cầu ${d.name} bổ sung hồ sơ`); setDetail(null); };

  return (
    <AdminShell title="Tài xế" subtitle="Quản lý đội ngũ shipper">
      {counts.pending > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-info/40 bg-info/10 p-4">
          <div>
            <p className="font-bold">{counts.pending} tài xế cần xác minh hồ sơ</p>
            <p className="text-sm text-muted-foreground">GPLX, cà vẹt xe và bảo hiểm cần được kiểm tra</p>
          </div>
          <button onClick={() => setTab("pending")} className="rounded-xl bg-info px-4 py-2 text-sm font-bold text-info-foreground">Bắt đầu</button>
        </div>
      )}

      <SectionCard title="Danh sách tài xế" action={
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm tên, biển số…" className="w-48 bg-transparent text-sm outline-none" />
        </div>
      }>
        <div className="-mt-2 mb-3 flex flex-wrap gap-2">
          {([["all", "Tất cả"], ["online", "Online"], ["pending", "Cần xác minh"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tab === k ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              {l} <span className={`rounded-full px-1.5 text-[10px] ${tab === k ? "bg-primary-foreground/20" : "bg-muted text-foreground"}`}>{counts[k]}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map(d => (
            <div key={d.id} className="rounded-2xl border bg-card p-4 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl">{d.avatar}</div>
                  {d.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.vehicle} · {d.plate}</p>
                </div>
                {d.verify === "verified" ? <StatusBadge variant="success">Đã xác minh</StatusBadge> :
                 d.verify === "pending" ? <StatusBadge variant="warning">Chờ xác minh</StatusBadge> :
                 <StatusBadge variant="destructive">Hết hạn</StatusBadge>}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-2 text-center text-xs">
                <div><p className="font-bold inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating}</p><p className="text-muted-foreground">Đánh giá</p></div>
                <div><p className="font-bold">{d.trips}</p><p className="text-muted-foreground">Cuốc</p></div>
                <div><p className="font-bold">{d.area}</p><p className="text-muted-foreground">Khu vực</p></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setDetail(d)} className="inline-flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold hover:bg-muted"><Eye className="h-3.5 w-3.5" />Hồ sơ</button>
                <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-destructive/30 bg-destructive/5 py-2 text-xs font-bold text-destructive">Tạm khoá</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-2xl">{detail.avatar}</div>
                  <div className="text-left">
                    <p>{detail.name}</p>
                    <p className="text-xs font-normal text-muted-foreground inline-flex items-center gap-1"><Phone className="h-3 w-3" />{detail.phone}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>Xác minh tài xế · {detail.area}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Phương tiện</p>
                    <p className="font-bold inline-flex items-center gap-1"><Bike className="h-4 w-4" />{detail.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{detail.plate}</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground">Hiệu suất</p>
                    <p className="font-bold inline-flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" />{detail.rating} / 5</p>
                    <p className="text-xs text-muted-foreground">{detail.trips} cuốc đã giao</p>
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Giấy tờ xác minh</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {[
                      { f: "Giấy phép lái xe (GPLX)", ok: detail.verify !== "expired" },
                      { f: "Cà vẹt xe", ok: true },
                      { f: "CCCD/CMND", ok: true },
                      { f: "Bảo hiểm xe máy", ok: detail.verify === "verified" },
                    ].map(({ f, ok }) => (
                      <li key={f} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                        <FileText className="h-4 w-4 text-info" />
                        <span className="flex-1">{f}</span>
                        {ok ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                        <button className="text-xs font-bold text-primary">Xem</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-info/10 p-3 text-xs text-info">
                  Hồ sơ phải đối chiếu với CSDL CSGT. Bảo hiểm cần còn hạn ≥ 30 ngày.
                </div>
              </div>
              {detail.verify !== "verified" && (
                <DialogFooter className="gap-2">
                  <button onClick={() => reject(detail)} className="rounded-xl border px-4 py-2 text-sm font-bold">Yêu cầu bổ sung</button>
                  <button onClick={() => approve(detail)} className="rounded-xl bg-success px-4 py-2 text-sm font-bold text-success-foreground">Xác minh & kích hoạt</button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
