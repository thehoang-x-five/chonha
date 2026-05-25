import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { Star, ShieldCheck, FileCheck, Bike, HelpCircle, LogOut } from "lucide-react";

export const Route = createFileRoute("/driver/profile")({ component: Page });

function Page() {
  return (
    <MobileShell nav={<DriverBottomNav />}>
      <AppHeader title="Hồ sơ tài xế" />
      <div className="bg-gradient-to-b from-primary/15 to-transparent px-4 pb-6 pt-4 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-card text-4xl shadow-sm">👨</div>
        <p className="mt-2 text-lg font-bold">Anh Hùng</p>
        <p className="text-xs text-muted-foreground">0908 111 222 · Quận 7</p>
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1 text-sm font-bold"><Star className="h-4 w-4 fill-warning text-warning" />4.9 · 1.280 cuốc</p>
      </div>

      <div className="mx-4 space-y-2">
        <Row icon={Bike} title="Phương tiện" desc="Honda Wave · 59X2-123.45" />
        <Row icon={ShieldCheck} title="Đã xác minh" desc="CMND, GPLX, Đăng ký xe" badge="success" />
        <Row icon={FileCheck} title="Bảo hiểm" desc="Còn hiệu lực đến 12/2025" badge="info" />
        <Row icon={HelpCircle} title="Trung tâm hỗ trợ" />
      </div>

      <div className="m-4">
        <Link to="/" className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </Link>
      </div>
    </MobileShell>
  );
}

function Row({ icon: Icon, title, desc, badge }: any) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {badge && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge === "success" ? "bg-success/15 text-success" : "bg-info/15 text-info"}`}>✓</span>}
    </div>
  );
}
