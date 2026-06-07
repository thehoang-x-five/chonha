import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/driver/support")({ component: Page });

function Page() {
  return (
    <MobileShell area="driver" nav={<DriverBottomNav />}>
      <AppHeader title="Hỗ trợ tài xế" back="/driver/profile" />
      <div className="space-y-3 p-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-5 text-primary-foreground">
          <p className="text-sm opacity-90">Cần hỗ trợ gấp?</p>
          <p className="text-xl font-bold">Đội điều phối 24/7</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href="tel:19001234" className="flex items-center justify-center gap-1.5 rounded-full bg-card py-2.5 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4" /> Gọi điều phối
            </a>
            <button
              type="button"
              onClick={() => notifyTodo("Chat điều phối")}
              className="flex items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
          </div>
        </div>
        <Link
          to="/driver/issues"
          className="flex items-center gap-3 rounded-2xl border bg-card p-4 active:bg-muted"
        >
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Báo cáo sự cố</p>
            <p className="text-xs text-muted-foreground">Gian hàng chưa sẵn, khách không nghe máy,…</p>
          </div>
        </Link>
      </div>
    </MobileShell>
  );
}
