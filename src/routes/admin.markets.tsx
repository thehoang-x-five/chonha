import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin-ui";
import { StatusBadge } from "@/components/status-badge";
import { markets, getStallsByMarket } from "@/lib/mock-data";
import { Search, MapPin, Clock, Star, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/markets")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<(typeof markets)[number] | null>(null);
  const rows = markets.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.address.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminShell title="Chợ truyền thống" subtitle="Mạng lưới chợ liên kết">
      <SectionCard title="Danh sách chợ" action={
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm chợ…" className="w-48 bg-transparent text-sm outline-none" />
        </div>
      }>
        <div className="overflow-hidden rounded-2xl border">
          <div className="hidden grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-xs font-bold uppercase text-muted-foreground md:grid">
            <div className="col-span-3">Tên chợ</div><div className="col-span-3">Địa chỉ</div><div className="col-span-1">Sạp</div><div className="col-span-2">Đơn hôm nay</div><div className="col-span-2">Trạng thái</div><div className="col-span-1"></div>
          </div>
          {rows.map(m => (
            <div key={m.id} className="grid grid-cols-2 gap-3 border-b p-4 last:border-b-0 hover:bg-muted/30 md:grid-cols-12 md:items-center">
              <div className="md:col-span-3">
                <p className="font-bold">{m.cover} {m.name}</p>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{m.rating} · {m.distanceKm} km</p>
              </div>
              <div className="hidden text-sm md:col-span-3 md:block">{m.address}</div>
              <div className="md:col-span-1"><span className="text-xs text-muted-foreground md:hidden">Sạp: </span><span className="font-semibold">{getStallsByMarket(m.id).length}</span></div>
              <div className="md:col-span-2"><span className="text-xs text-muted-foreground md:hidden">Đơn: </span><span className="font-semibold">{Math.floor(Math.random() * 80) + 20}</span></div>
              <div className="md:col-span-2"><StatusBadge variant={m.status === "open" ? "success" : m.status === "closing" ? "warning" : "muted"}>{m.status === "open" ? "Mở cửa" : m.status === "closing" ? "Sắp đóng" : "Đóng"}</StatusBadge></div>
              <div className="md:col-span-1 md:text-right"><button onClick={() => setDetail(m)} className="tap-target grid place-items-center rounded-full hover:bg-muted"><Eye className="h-4 w-4" /></button></div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-md">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{detail.cover} {detail.name}</DialogTitle>
                <DialogDescription className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{detail.address}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Mini l="Sạp" v={`${getStallsByMarket(detail.id).length}`} />
                <Mini l="Đánh giá" v={`${detail.rating}★`} />
                <Mini l="Phí giao" v={`${(detail.deliveryFeeFrom / 1000).toFixed(0)}k`} />
              </div>
              <div className="rounded-xl border p-3 text-sm">
                <p className="inline-flex items-center gap-1 font-semibold"><Clock className="h-4 w-4 text-primary" /> Giờ hoạt động</p>
                <p className="mt-1 text-muted-foreground">{detail.openingHours}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Mini({ l, v }: { l: string; v: string }) { return <div className="rounded-xl bg-muted/50 p-3"><p className="text-xl font-extrabold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>; }
