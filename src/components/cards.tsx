import { Link } from "@tanstack/react-router";
import { MapPin, Star, Sparkles, ChefHat, Bike, Clock } from "lucide-react";
import type { Market, Stall, Product } from "@/lib/mock-data";
import { formatVnd } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link to="/customer/markets/$id" params={{ id: market.id }} className="block">
      <div className="group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition active:scale-[0.99]">
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.72_0.17_45_/_0.35),transparent_55%),radial-gradient(circle_at_85%_75%,oklch(0.62_0.16_145_/_0.4),transparent_55%)]" />
          <div className="absolute inset-0 grid place-items-center text-6xl drop-shadow-sm">{market.cover}</div>
          <div className="absolute left-3 top-3">
            <StatusBadge variant={market.status === "open" ? "success" : market.status === "closing" ? "warning" : "muted"} className="bg-card/90 backdrop-blur">
              {market.status === "open" ? "Đang mở" : market.status === "closing" ? "Sắp đóng" : "Đóng cửa"}
            </StatusBadge>
          </div>
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-xs font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-warning text-warning" />{market.rating}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-bold leading-tight">{market.name}</h3>
            <span className="shrink-0 text-xs font-semibold text-primary">{market.distanceKm} km</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{market.address}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{market.openingHours}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              <Bike className="h-3 w-3" /> Từ {formatVnd(market.deliveryFeeFrom)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StallCard({ stall }: { stall: Stall }) {
  return (
    <Link to="/customer/stalls/$id" params={{ id: stall.id }} className="block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition active:scale-[0.98]">
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/25 via-primary/10 to-accent" />
          <div className="absolute inset-0 grid place-items-center text-5xl">{stall.cover}</div>
          {!stall.open && (
            <div className="absolute inset-0 grid place-items-center bg-foreground/50 text-xs font-semibold text-background backdrop-blur-sm">
              Đang nghỉ
            </div>
          )}
          <div className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-card/95 px-1.5 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur">
            <Star className="h-2.5 w-2.5 fill-warning text-warning" />{stall.rating}
            <span className="text-muted-foreground">· {stall.yearsActive}n</span>
          </div>
        </div>
        <div className="p-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{stall.avatar}</span>
            <h4 className="truncate text-sm font-bold">{stall.name}</h4>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{stall.specialty}</p>
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const hasPrep = (product.prepOptions?.length ?? 0) > 0;
  return (
    <Link to="/customer/products/$id" params={{ id: product.id }} className="block">
      <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition active:scale-[0.98]">
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-muted" />
          <div className="absolute inset-0 grid place-items-center text-6xl transition-transform group-hover:scale-105">{product.image}</div>
          {product.freshNote && (
            <div className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-success/95 px-2 py-0.5 text-[10px] font-bold text-success-foreground shadow-sm">
              <Sparkles className="h-2.5 w-2.5" /> Tươi
            </div>
          )}
          {hasPrep && (
            <div className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-card/95 shadow-sm" title="Có sơ chế">
              <ChefHat className="h-3 w-3 text-secondary" />
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 grid place-items-center bg-foreground/55 text-xs font-bold text-background backdrop-blur-sm">
              Tạm hết hàng
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-tight">{product.name}</p>
          <div className="mt-1.5 flex items-baseline gap-0.5">
            <span className="text-base font-extrabold text-primary leading-none">{formatVnd(product.price)}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">/{product.unit}</p>
        </div>
      </div>
    </Link>
  );
}

export function MapPlaceholder({ className = "", label = "Bản đồ minh hoạ", driver = false }: { className?: string; label?: string; driver?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-info/10 to-secondary/10 ${className}`}>
      <svg className="absolute inset-0 h-full w-full opacity-50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 400 240">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground"/>
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#grid)"/>
        <path d="M0 180 Q 80 150 140 170 T 260 140 T 400 80" stroke="currentColor" className="text-info/50" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M 40 210 Q 140 100 240 150 T 380 60" stroke="currentColor" className="text-primary" strokeWidth="3.5" strokeDasharray="6 6" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="210" r="7" className="fill-secondary" />
        <circle cx="380" cy="60" r="7" className="fill-primary" />
      </svg>
      {driver && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/25">
            <Bike className="h-5 w-5" />
            <span className="absolute -inset-2 animate-ping rounded-full bg-primary/30" />
          </div>
        </div>
      )}
      <div className="relative grid h-full min-h-[180px] place-items-end">
        <div className="m-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">{label}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, emoji }: { icon?: any; title: string; description?: string; action?: React.ReactNode; emoji?: string }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      {emoji ? (
        <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 text-4xl">{emoji}</div>
      ) : Icon ? (
        <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground"><Icon className="h-7 w-7" /></div>
      ) : null}
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
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
