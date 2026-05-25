import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Star } from "lucide-react";
import type { Market, Stall, Product } from "@/lib/mock-data";
import { formatVnd } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link to="/customer/markets/$id" params={{ id: market.id }} className="block">
      <div className="flex gap-3 rounded-2xl border bg-card p-3 transition active:scale-[0.98]">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-4xl">
          {market.cover}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold">{market.name}</h3>
            <StatusBadge variant={market.status === "open" ? "success" : market.status === "closing" ? "warning" : "muted"}>
              {market.status === "open" ? "Mở cửa" : market.status === "closing" ? "Sắp đóng" : "Đóng cửa"}
            </StatusBadge>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {market.distanceKm} km
            <span className="mx-1">·</span>
            <Star className="h-3 w-3 fill-warning text-warning" /> {market.rating}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{market.address}</p>
          <p className="mt-1 text-xs font-semibold text-primary">Phí giao từ {formatVnd(market.deliveryFeeFrom)}</p>
        </div>
      </div>
    </Link>
  );
}

export function StallCard({ stall }: { stall: Stall }) {
  return (
    <Link to="/customer/stalls/$id" params={{ id: stall.id }} className="block">
      <div className="overflow-hidden rounded-2xl border bg-card transition active:scale-[0.98]">
        <div className="relative grid h-24 place-items-center bg-gradient-to-br from-primary/15 to-accent text-5xl">
          {stall.cover}
          {!stall.open && <span className="absolute inset-0 grid place-items-center bg-foreground/40 text-sm font-semibold text-background">Đang đóng</span>}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="font-semibold">{stall.rating}</span>
            <span className="text-muted-foreground">· {stall.yearsActive} năm</span>
          </div>
          <h4 className="mt-0.5 truncate font-semibold">{stall.name}</h4>
          <p className="truncate text-xs text-muted-foreground">{stall.specialty}</p>
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product, onAdd }: { product: Product; onAdd?: () => void }) {
  return (
    <Link to="/customer/products/$id" params={{ id: product.id }} className="block">
      <div className="overflow-hidden rounded-2xl border bg-card transition active:scale-[0.98]">
        <div className="relative grid aspect-square place-items-center bg-gradient-to-br from-accent to-muted text-6xl">
          {product.image}
          {!product.inStock && <span className="absolute inset-0 grid place-items-center bg-foreground/50 text-xs font-bold text-background">Hết hàng</span>}
        </div>
        <div className="p-2.5">
          <p className="truncate text-sm font-medium leading-tight">{product.name}</p>
          <p className="mt-1 text-sm font-bold text-primary">{formatVnd(product.price)}<span className="text-xs font-normal text-muted-foreground">/{product.unit}</span></p>
        </div>
      </div>
    </Link>
  );
}

export function MapPlaceholder({ className = "", label = "Bản đồ minh hoạ" }: { className?: string; label?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-info/10 to-secondary/10 ${className}`}>
      <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <path d="M 20 80 Q 100 40 180 120 T 360 60" stroke="currentColor" className="text-primary" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="relative grid h-full min-h-[180px] place-items-center">
        <div className="rounded-full bg-card/90 px-3 py-1 text-xs text-muted-foreground shadow-sm">{label}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground"><Icon className="h-7 w-7" /></div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function KPIStatCard({ label, value, hint, accent = "primary" }: { label: string; value: string; hint?: string; accent?: "primary" | "secondary" | "success" | "warning" | "info" }) {
  const accentMap = {
    primary: "from-primary/15 to-primary/5 text-primary",
    secondary: "from-secondary/15 to-secondary/5 text-secondary",
    success: "from-success/15 to-success/5 text-success",
    warning: "from-warning/20 to-warning/5 text-foreground",
    info: "from-info/15 to-info/5 text-info",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${accentMap[accent]} p-4`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
