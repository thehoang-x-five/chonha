import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { AdminKPI, SectionCard, AreaChart } from "@/components/admin-ui";
import { formatVnd, markets, orders, getMarket, getDriver } from "@/lib/mock-data";
import { StatusBadge, orderStatusLabel } from "@/components/status-badge";
import { TrendingUp, Wallet, Store, Bike, AlertTriangle, Download, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({ component: Page });

const revenueData = [12, 18, 16, 21, 25, 29, 24];
const revenueLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const orderVolume = [120, 180, 160, 210, 250, 290, 240];

function Page() {
  return (
    <AdminShell title="Tổng quan" subtitle="Hôm nay · Quận 7, TP.HCM" actions={
      <button className="hidden items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground lg:inline-flex">
        <Download className="h-3.5 w-3.5" /> Xuất báo cáo
      </button>
    }>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <AdminKPI label="Đơn hôm nay" value="248" icon={TrendingUp} trend={{ dir: "up", value: "18%" }} hint="so với hôm qua" accent="primary" />
        <AdminKPI label="Doanh thu" value={formatVnd(54200000)} icon={Wallet} trend={{ dir: "up", value: "12%" }} hint="GMV" accent="success" />
        <AdminKPI label="Gian hàng hoạt động" value="42 / 48" icon={Store} hint="3 đang chờ duyệt" accent="info" />
        <AdminKPI label="Tài xế online" value="12" icon={Bike} trend={{ dir: "down", value: "2" }} hint="trên tổng 28" accent="warning" />
        <AdminKPI label="Đơn có sự cố" value="2" icon={AlertTriangle} hint="cần xử lý ngay" accent="destructive" />
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Doanh thu 7 ngày" className="xl:col-span-2" action={
          <div className="flex gap-1 rounded-full bg-muted p-0.5 text-xs">
            {["Ngày", "Tuần", "Tháng"].map((t, i) => (
              <button key={t} className={`rounded-full px-3 py-1 font-semibold ${i === 1 ? "bg-card shadow" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        }>
          <div className="mb-3 flex items-end gap-6">
            <div>
              <p className="text-3xl font-extrabold tracking-tight">{formatVnd(382500000)}</p>
              <p className="text-xs text-muted-foreground">GMV tuần này</p>
            </div>
            <span className="mb-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">▲ 14.2%</span>
          </div>
          <AreaChart data={revenueData} labels={revenueLabels} color="primary" />
        </SectionCard>

        <SectionCard title="Hiệu suất giao hàng">
          <ul className="space-y-3">
            {[
              { l: "Đúng giờ", v: 92, c: "bg-success" },
              { l: "Trễ < 10p", v: 6, c: "bg-warning" },
              { l: "Trễ > 10p", v: 2, c: "bg-destructive" },
            ].map((s) => (
              <li key={s.l}>
                <div className="flex justify-between text-sm"><span>{s.l}</span><span className="font-bold">{s.v}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${s.c}`} style={{ width: `${s.v}%` }} /></div>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <Mini label="TB nhận" value="2'" />
            <Mini label="TB chuẩn bị" value="18'" />
            <Mini label="TB giao" value="22'" />
          </div>
        </SectionCard>

        <SectionCard title="Đơn theo ngày" className="xl:col-span-2">
          <div className="flex h-44 items-end gap-2">
            {orderVolume.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-secondary to-secondary/30 transition hover:from-primary hover:to-primary/30" style={{ height: `${(v / Math.max(...orderVolume)) * 100}%` }} />
                </div>
                <span className="text-[11px] font-semibold">{revenueLabels[i]}</span>
                <span className="text-[10px] text-muted-foreground">{v}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Doanh thu theo chợ">
          <ul className="space-y-3">
            {markets.map((m, i) => {
              const pct = [70, 50, 40][i];
              return (
                <li key={m.id}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{m.cover} {m.name}</span><span className="text-muted-foreground">{formatVnd(15000000 - i * 3500000)}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-gradient-to-r from-primary to-info" style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* Recent orders + alerts */}
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Đơn hàng gần đây" className="xl:col-span-2" action={
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
        }>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="pb-2 text-left">Mã</th><th className="text-left">Khách</th><th className="text-left">Chợ</th><th className="text-left">Tài xế</th><th className="text-right">Tổng</th><th className="text-right">Trạng thái</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => {
                  const m = getMarket(o.marketId)!;
                  const d = getDriver(o.driverId);
                  const meta = orderStatusLabel[o.status];
                  return (
                    <tr key={o.id} className="border-t">
                      <td className="py-2 font-mono text-xs">#{o.code.slice(-5)}</td>
                      <td className="font-semibold">{o.customer}</td>
                      <td className="text-muted-foreground">{m.name}</td>
                      <td className="text-muted-foreground">{d?.name ?? "—"}</td>
                      <td className="text-right font-semibold">{formatVnd(o.total)}</td>
                      <td className="text-right"><StatusBadge variant={meta.variant}>{meta.label}</StatusBadge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Cần xử lý">
          <ul className="space-y-2 text-sm">
            <Alert tone="destructive" title="2 đơn báo sự cố" desc="Khách chưa nhận được hàng" />
            <Alert tone="warning" title="3 gian hàng chờ duyệt" desc="Hồ sơ mới gửi sáng nay" />
            <Alert tone="info" title="1 tài xế chờ xác minh" desc="GPLX & cà vẹt xe" />
            <Alert tone="success" title="Tuần này đạt 92% đúng giờ" desc="Vượt mục tiêu KPI" />
          </ul>
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-muted/50 p-2"><p className="text-base font-extrabold text-primary">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}

function Alert({ tone, title, desc }: { tone: "destructive" | "warning" | "info" | "success"; title: string; desc: string }) {
  const map = { destructive: "border-destructive/30 bg-destructive/5", warning: "border-warning/40 bg-warning/10", info: "border-info/30 bg-info/5", success: "border-success/30 bg-success/5" };
  return (
    <li className={`rounded-xl border p-3 ${map[tone]}`}>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </li>
  );
}
