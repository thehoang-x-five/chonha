import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Store, ClipboardList, ShoppingBasket, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const items: { to: string; label: string; icon: any; badge?: boolean }[] = [
  { to: "/customer/home", label: "Trang chủ", icon: Home },
  { to: "/customer/favorites", label: "Sạp quen", icon: Store },
  { to: "/customer/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/customer/cart", label: "Giỏ hàng", icon: ShoppingBasket, badge: true },
  { to: "/customer/profile", label: "Tài khoản", icon: User },
];

export function CustomerBottomNav() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { count } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur safe-bottom">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const active = path === to;
          return (
            <li key={to}>
              <Link to={to as any} className={`tap-target flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  {badge && count > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground">{count}</span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const vendorItems = [
  { to: "/vendor/dashboard", label: "Hôm nay", icon: Home },
  { to: "/vendor/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/vendor/products", label: "Sản phẩm", icon: Store },
  { to: "/vendor/revenue", label: "Doanh thu", icon: ShoppingBasket },
  { to: "/vendor/profile", label: "Gian hàng", icon: User },
] as const;

export function VendorBottomNav() {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t-2 bg-card/95 backdrop-blur safe-bottom">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {vendorItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <li key={to}>
              <Link to={to as any} className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[13px] font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-7 w-7" strokeWidth={active ? 2.6 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const driverItems = [
  { to: "/driver/home", label: "Trang chủ", icon: Home },
  { to: "/driver/trips", label: "Cuốc giao", icon: ClipboardList },
  { to: "/driver/earnings", label: "Thu nhập", icon: ShoppingBasket },
  { to: "/driver/profile", label: "Hồ sơ", icon: User },
] as const;

export function DriverBottomNav() {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur safe-bottom">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {driverItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <li key={to}>
              <Link to={to as any} className={`tap-target flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
