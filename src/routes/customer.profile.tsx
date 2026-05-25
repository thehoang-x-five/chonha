import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { User, MapPin, Ticket, CreditCard, HelpCircle, LogOut, ChevronRight, Heart } from "lucide-react";

export const Route = createFileRoute("/customer/profile")({ component: Page });

const items = [
  { icon: User, label: "Thông tin cá nhân" },
  { icon: MapPin, label: "Địa chỉ đã lưu" },
  { icon: Heart, label: "Sạp quen" },
  { icon: Ticket, label: "Ví voucher" },
  { icon: CreditCard, label: "Phương thức thanh toán" },
  { icon: HelpCircle, label: "Trung tâm hỗ trợ" },
];

function Page() {
  return (
    <MobileShell nav={<CustomerBottomNav />}>
      <AppHeader title="Tài khoản" />
      <div className="bg-gradient-to-b from-primary/15 to-transparent px-4 pb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-3xl shadow-sm">👩</div>
          <div>
            <p className="font-bold">Chị Mai</p>
            <p className="text-xs text-muted-foreground">0909 123 456</p>
            <p className="mt-1 inline-block rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">Khách hàng thân thiết</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-2 overflow-hidden rounded-2xl border bg-card">
        {items.map((it, i) => (
          <button key={i} className={`tap-target flex w-full items-center gap-3 px-4 py-3.5 text-left ${i ? "border-t" : ""}`}>
            <it.icon className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm font-medium">{it.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="m-4">
        <Link to="/" className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </Link>
      </div>
    </MobileShell>
  );
}
