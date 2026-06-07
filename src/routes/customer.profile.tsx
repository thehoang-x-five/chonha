import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { LogoutButton } from "@/components/common/LogoutButton";
import { NotificationBell } from "@/components/common/NotificationBell";
import { User, MapPin, Ticket, CreditCard, HelpCircle, ChevronRight, Heart, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/customer/profile")({ component: Page });

const items: { icon: any; label: string; to?: string; onClick?: () => void }[] = [
  { icon: User, label: "Thông tin cá nhân", to: "/customer/profile/edit" },
  { icon: MapPin, label: "Sổ địa chỉ", to: "/customer/addresses" },
  { icon: Heart, label: "Sạp quen", to: "/customer/favorites" },
  { icon: Ticket, label: "Ví voucher", to: "/customer/vouchers" },
  { icon: Bell, label: "Thông báo", to: "/customer/notifications" },
  { icon: CreditCard, label: "Phương thức thanh toán", onClick: () => notifyTodo("Phương thức thanh toán") },
  { icon: HelpCircle, label: "Trung tâm hỗ trợ", to: "/customer/support" },
];

function Page() {
  const { user } = useAuth();
  return (
    <MobileShell nav={<CustomerBottomNav />} area="customer">
      <AppHeader title="Tài khoản" right={<NotificationBell to="/customer/notifications" />} />
      <div className="bg-gradient-to-b from-primary/15 to-transparent px-4 pb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-3xl shadow-sm">👩</div>
          <div className="min-w-0">
            <p className="truncate font-bold">{user?.name ?? "Khách"}</p>
            <p className="text-xs text-muted-foreground">{user?.phone ?? "—"}</p>
            <p className="mt-1 inline-block rounded-full bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">Khách hàng thân thiết</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-2 overflow-hidden rounded-2xl border bg-card">
        {items.map((it, i) => {
          const content = (
            <>
              <it.icon className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium">{it.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </>
          );
          const className = `tap-target flex w-full items-center gap-3 px-4 py-3.5 text-left ${i ? "border-t" : ""}`;
          return it.to ? (
            <Link key={i} to={it.to as any} className={className}>{content}</Link>
          ) : (
            <button key={i} type="button" onClick={it.onClick} className={className}>{content}</button>
          );
        })}
      </div>

      <div className="m-4">
        <LogoutButton />
      </div>
    </MobileShell>
  );
}
