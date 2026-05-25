import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/status-badge";
import { stalls, getMarket } from "@/lib/mock-data";
import { Check, X, Pause, Search } from "lucide-react";

export const Route = createFileRoute("/admin/stalls")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const filtered = stalls.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminShell title="Gian hàng">
      <div className="mb-4 flex items-center gap-2 rounded-2xl border bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm gian hàng…" className="h-11 flex-1 bg-transparent outline-none" />
      </div>

      <div className="mb-4 rounded-2xl border bg-warning/10 p-4">
        <p className="font-bold">3 gian hàng đang chờ duyệt</p>
        <p className="text-sm text-muted-foreground">Vui lòng xem hồ sơ và xác nhận</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(s => {
          const m = getMarket(s.marketId)!;
          return (
            <div key={s.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl">{s.cover}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.name} · {s.category}</p>
                </div>
                <StatusBadge variant={s.open ? "success" : "muted"}>{s.open ? "Hoạt động" : "Đóng"}</StatusBadge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button className="flex items-center justify-center gap-1 rounded-xl bg-success py-2 text-xs font-bold text-success-foreground"><Check className="h-3.5 w-3.5" />Duyệt</button>
                <button className="flex items-center justify-center gap-1 rounded-xl bg-destructive py-2 text-xs font-bold text-destructive-foreground"><X className="h-3.5 w-3.5" />Từ chối</button>
                <button className="flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold"><Pause className="h-3.5 w-3.5" />Tạm khoá</button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
