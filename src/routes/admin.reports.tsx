import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { formatVnd, markets, stalls } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/reports")({ component: Page });

function Page() {
  return (
    <AdminShell title="Báo cáo">
      <div className="mb-4 flex flex-wrap gap-2">
        {["Hôm nay","7 ngày","30 ngày","Quý này"].map((t, i) => (
          <button key={t} className={`rounded-full border px-4 py-2 text-sm font-semibold ${i === 1 ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Doanh thu theo chợ">
          <ul className="space-y-2">
            {markets.map((m, i) => (
              <li key={m.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3"><span className="font-semibold">{m.name}</span><span className="font-bold text-primary">{formatVnd(35000000 - i * 8000000)}</span></li>
            ))}
          </ul>
        </Section>
        <Section title="Doanh thu theo gian hàng (Top 5)">
          <ul className="space-y-2">
            {stalls.slice(0,5).map((s, i) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3"><span>{s.cover} <b>{s.name}</b></span><span className="font-bold text-primary">{formatVnd(12000000 - i * 1500000)}</span></li>
            ))}
          </ul>
        </Section>
        <Section title="Thời gian giao trung bình">
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Nhận đơn" value="2 phút" />
            <Stat label="Chuẩn bị" value="18 phút" />
            <Stat label="Giao" value="22 phút" />
          </div>
        </Section>
        <Section title="Lý do huỷ đơn">
          <ul className="space-y-2 text-sm">
            {[["Khách đổi ý",35],["Hết hàng",28],["Không tìm được tài xế",18],["Sai địa chỉ",12],["Khác",7]].map(([l,v]) => (
              <li key={l as string}><div className="flex justify-between"><span>{l}</span><span className="font-bold">{v}%</span></div><div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-secondary" style={{ width: `${v}%` }} /></div></li>
            ))}
          </ul>
        </Section>
      </div>
    </AdminShell>
  );
}
function Section({ title, children }: any) { return <div className="rounded-2xl border bg-card p-5"><h3 className="mb-3 font-bold">{title}</h3>{children}</div>; }
function Stat({ label, value }: any) { return <div className="rounded-xl bg-muted/50 p-3"><p className="text-xl font-extrabold text-primary">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>; }
