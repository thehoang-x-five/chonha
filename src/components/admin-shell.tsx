import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Store, ShoppingBag, Package, ClipboardList, Users, Route as RouteIcon, BarChart3, Settings, Menu, X, Search, Bell, ChevronDown, Ticket, LifeBuoy, UsersRound } from "lucide-react";
import { useState } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";

const items = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/markets", label: "Chợ truyền thống", icon: Store },
  { to: "/admin/stalls", label: "Gian hàng", icon: ShoppingBag },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/admin/drivers", label: "Tài xế", icon: Users },
  { to: "/admin/dispatch", label: "Điều phối", icon: RouteIcon },
  { to: "/admin/users", label: "Người dùng", icon: UsersRound },
  { to: "/admin/vouchers", label: "Khuyến mãi", icon: Ticket },
  { to: "/admin/notifications", label: "Thông báo", icon: Bell },
  { to: "/admin/tickets", label: "Phiếu hỗ trợ", icon: LifeBuoy },
  { to: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
  { to: "/admin/settings", label: "Cấu hình", icon: Settings },
] as const;

export function AdminShell({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <RoleGuard area="admin">
    <div className="min-h-dvh bg-muted/30">
      {/* Mobile top */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-card px-3 lg:hidden">
        <button onClick={() => setOpen(true)} className="tap-target -ml-2 grid place-items-center"><Menu className="h-5 w-5" /></button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Chợ Nhà Mình · Admin</p>
          <h1 className="-mt-0.5 truncate text-sm font-semibold">{title}</h1>
        </div>
        <button className="tap-target grid place-items-center rounded-full hover:bg-muted"><Bell className="h-5 w-5" /></button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg">🧺</div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Quản trị viên</p>
                <p className="-mt-0.5 font-extrabold text-primary">Chợ Nhà Mình</p>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="tap-target grid place-items-center lg:hidden"><X className="h-5 w-5" /></button>
          </div>
          <nav className="p-2">
            {items.map(({ to, label, icon: Icon }) => {
              const active = path === to || path.startsWith(to + "/");
              return (
                <Link key={to} to={to} onClick={() => setOpen(false)} className={`mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 border-t p-3">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-3">
              <p className="text-xs font-semibold">Cần hỗ trợ?</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Liên hệ đội vận hành 24/7</p>
              <button className="mt-2 w-full rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground">Gọi hỗ trợ</button>
            </div>
          </div>
        </aside>

        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" />}

        <main className="min-w-0 flex-1">
          {/* Desktop top header */}
          <div className="sticky top-0 z-30 hidden items-center gap-4 border-b bg-card/95 px-6 py-3 backdrop-blur lg:flex">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{subtitle ?? "Bảng điều khiển"}</p>
              <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm xl:flex">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input placeholder="Tìm đơn, gian hàng, tài xế…" className="w-64 bg-transparent outline-none placeholder:text-muted-foreground" />
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
              </div>
              <button className="relative grid h-9 w-9 place-items-center rounded-full border hover:bg-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
              </button>
              {actions}
              <button className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 hover:bg-muted">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm">👤</div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Mai Anh</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">Operations</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
    </RoleGuard>
  );
}
