import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Store, ShoppingBag, Package, ClipboardList, Users, Route as RouteIcon, BarChart3, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

const items = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/markets", label: "Chợ truyền thống", icon: Store },
  { to: "/admin/stalls", label: "Gian hàng", icon: ShoppingBag },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/admin/drivers", label: "Tài xế", icon: Users },
  { to: "/admin/dispatch", label: "Điều phối", icon: RouteIcon },
  { to: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
  { to: "/admin/settings", label: "Cấu hình", icon: Settings },
] as const;

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile top */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-card px-3 lg:hidden">
        <button onClick={() => setOpen(true)} className="tap-target -ml-2 grid place-items-center"><Menu className="h-5 w-5" /></button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Chợ Nhà Mình · Admin</p>
          <h1 className="-mt-0.5 truncate text-sm font-semibold">{title}</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
            <div>
              <p className="text-xs text-muted-foreground">Quản trị viên</p>
              <p className="font-bold text-primary">Chợ Nhà Mình</p>
            </div>
            <button onClick={() => setOpen(false)} className="tap-target grid place-items-center lg:hidden"><X className="h-5 w-5" /></button>
          </div>
          <nav className="p-2">
            {items.map(({ to, label, icon: Icon }) => {
              const active = path === to;
              return (
                <Link key={to} to={to} onClick={() => setOpen(false)} className={`mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" />}

        <main className="min-w-0 flex-1">
          <div className="hidden border-b bg-card px-6 py-4 lg:block">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
