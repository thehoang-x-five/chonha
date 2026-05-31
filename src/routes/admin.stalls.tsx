import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin-ui";
import { StatusBadge } from "@/components/status-badge";
import { stalls, getMarket, type Stall } from "@/lib/mock-data";
import { Check, X, Pause, Search, Eye, FileText, MapPin, Phone, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/stalls")({ component: Page });

type Status = "pending" | "active" | "suspended";
// Synthesize statuses from mock data
const enriched = stalls.map((s, i) => ({ ...s, regStatus: (i < 3 ? "pending" : s.open ? "active" : "suspended") as Status }));

function Page() {
  const [tab, setTab] = useState<Status | "all">("pending");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<typeof enriched[number] | null>(null);

  const counts = useMemo(() => ({
    pending: enriched.filter(s => s.regStatus === "pending").length,
    active: enriched.filter(s => s.regStatus === "active").length,
    suspended: enriched.filter(s => s.regStatus === "suspended").length,
    all: enriched.length,
  }), []);

  const rows = enriched.filter(s => (tab === "all" || s.regStatus === tab) && s.name.toLowerCase().includes(q.toLowerCase()));

  const approve = (name: string) => { toast.success(`Đã duyệt "${name}"`); setDetail(null); };
  const reject = (name: string) => { toast.error(`Đã từ chối "${name}"`); setDetail(null); };

  return (
    <AdminShell title="Gian hàng" subtitle="Quản lý & duyệt hồ sơ sạp">
      {counts.pending > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <div>
            <p className="font-bold">{counts.pending} gian hàng đang chờ duyệt</p>
            <p className="text-sm text-muted-foreground">Vui lòng xem hồ sơ và xác nhận để chủ sạp được vào bán</p>
          </div>
          <button onClick={() => setTab("pending")} className="rounded-xl bg-warning px-4 py-2 text-sm font-bold text-warning-foreground">Xem hồ sơ</button>
        </div>
      )}

      <SectionCard title="Danh sách gian hàng" action={
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm gian hàng…" className="w-48 bg-transparent text-sm outline-none" />
        </div>
      }>
        <div className="-mt-2 mb-3 flex flex-wrap gap-2">
          {([["pending", "Chờ duyệt"], ["active", "Đang hoạt động"], ["suspended", "Tạm khoá"], ["all", "Tất cả"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k as any)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tab === k ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              {l} <span className={`rounded-full px-1.5 text-[10px] ${tab === k ? "bg-primary-foreground/20" : "bg-muted text-foreground"}`}>{counts[k as keyof typeof counts]}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map(s => {
            const m = getMarket(s.marketId)!;
            const statusBadge =
              s.regStatus === "pending" ? <StatusBadge variant="warning">Chờ duyệt</StatusBadge> :
              s.regStatus === "active" ? <StatusBadge variant="success">Hoạt động</StatusBadge> :
              <StatusBadge variant="muted">Tạm khoá</StatusBadge>;
            return (
              <div key={s.id} className="rounded-2xl border bg-card p-4 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl">{s.cover}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.name} · {s.category}</p>
                  </div>
                  {statusBadge}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Chủ sạp: <b>{s.owner}</b> · {s.yearsActive} năm kinh nghiệm</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {s.regStatus === "pending" ? (
                    <>
                      <button onClick={() => approve(s.name)} className="flex items-center justify-center gap-1 rounded-xl bg-success py-2 text-xs font-bold text-success-foreground hover:opacity-90"><Check className="h-3.5 w-3.5" />Duyệt</button>
                      <button onClick={() => reject(s.name)} className="flex items-center justify-center gap-1 rounded-xl bg-destructive py-2 text-xs font-bold text-destructive-foreground hover:opacity-90"><X className="h-3.5 w-3.5" />Từ chối</button>
                      <button onClick={() => setDetail(s)} className="flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold hover:bg-muted"><Eye className="h-3.5 w-3.5" />Hồ sơ</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setDetail(s)} className="col-span-2 flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold hover:bg-muted"><Eye className="h-3.5 w-3.5" />Xem chi tiết</button>
                      <button className="flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold hover:bg-muted"><Pause className="h-3.5 w-3.5" />Khoá</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl">{detail.cover}</div>
                  <div className="text-left">
                    <p>{detail.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{getMarket(detail.marketId)?.name}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>Hồ sơ đăng ký gian hàng</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Info label="Chủ sạp" value={detail.owner} icon={<Phone className="h-3.5 w-3.5" />} extra="0912 345 678" />
                <Info label="Chuyên bán" value={detail.specialty} />
                <Info label="Năm kinh nghiệm" value={`${detail.yearsActive} năm`} />
                <Info label="Vị trí" value="Lô B12, khu nhà lồng A" icon={<MapPin className="h-3.5 w-3.5" />} />
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Hồ sơ đính kèm</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {["CCCD chủ sạp", "Giấy đăng ký kinh doanh", "Hợp đồng thuê sạp", "Ảnh thực tế gian hàng"].map(f => (
                      <li key={f} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2"><FileText className="h-4 w-4 text-info" /><span className="flex-1">{f}.pdf</span><button className="text-xs font-bold text-primary">Xem</button></li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-success/10 p-3 text-sm">
                  <p className="font-bold text-success">✓ Đối chiếu thông tin BCT khớp</p>
                </div>
              </div>
              {detail.regStatus === "pending" && (
                <DialogFooter className="gap-2">
                  <button onClick={() => reject(detail.name)} className="rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">Từ chối</button>
                  <button onClick={() => approve(detail.name)} className="rounded-xl bg-success px-4 py-2 text-sm font-bold text-success-foreground">Duyệt gian hàng</button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Info({ label, value, icon, extra }: { label: string; value: string; icon?: React.ReactNode; extra?: string }) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
      {extra && <p className="text-xs text-muted-foreground inline-flex items-center gap-1">{icon}{extra}</p>}
    </div>
  );
}
