import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Bell, X, Phone } from "lucide-react";
import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatVnd } from "@/lib/mock-data";

/**
 * Big, friendly header for older stall owners.
 * - 64px height, 20px title, larger back arrow.
 */
export function VendorHeader({ title, subtitle, back, right }: { title: string; subtitle?: string; back?: string | true; right?: ReactNode }) {
  return (
    <header className="safe-top sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-3">
        {back && (
          back === true
            ? <button onClick={() => history.back()} aria-label="Quay lại" className="grid h-12 w-12 place-items-center rounded-full active:bg-muted"><ArrowLeft className="h-6 w-6" /></button>
            : <Link to={back as string} aria-label="Quay lại" className="grid h-12 w-12 place-items-center rounded-full active:bg-muted"><ArrowLeft className="h-6 w-6" /></Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

/** High-contrast status pill, larger than the generic StatusBadge. */
export function BigStatus({ variant, children }: { variant: "new" | "preparing" | "ready" | "handed" | "done" | "cancelled"; children: ReactNode }) {
  const map: Record<string, string> = {
    new: "bg-secondary text-secondary-foreground",
    preparing: "bg-warning text-foreground",
    ready: "bg-info text-info-foreground",
    handed: "bg-primary text-primary-foreground",
    done: "bg-success text-success-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-extrabold ${map[variant]}`}>{children}</span>;
}

export const VENDOR_STEPS = [
  { key: "received", label: "Nhận đơn", color: "bg-secondary text-secondary-foreground" },
  { key: "preparing", label: "Đang chuẩn bị", color: "bg-warning text-foreground" },
  { key: "ready", label: "Đã sẵn sàng", color: "bg-info text-info-foreground" },
  { key: "handed", label: "Đã giao tài xế", color: "bg-success text-success-foreground" },
] as const;

/** Visible step progress with very large numbers + labels. */
export function StepProgress({ step }: { step: number }) {
  return (
    <ol className="space-y-3">
      {VENDOR_STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={s.key} className="flex items-center gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-extrabold ${done ? "bg-success text-success-foreground" : active ? s.color : "border-2 bg-muted text-muted-foreground"}`}>
              {done ? <Check className="h-6 w-6" /> : i + 1}
            </div>
            <span className={`text-lg ${active ? "font-extrabold" : done ? "font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** Big urgent banner that draws attention to new orders. */
export function UrgentOrderAlert({ count, to }: { count: number; to: string }) {
  if (count <= 0) return null;
  return (
    <Link to={to as any} className="mx-4 mt-4 flex items-center gap-4 rounded-3xl border-2 border-secondary bg-secondary/15 p-4 shadow-sm active:scale-[0.99]">
      <div className="grid h-14 w-14 shrink-0 animate-pulse place-items-center rounded-2xl bg-secondary text-secondary-foreground">
        <Bell className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="text-xl font-extrabold text-secondary">Có {count} đơn mới!</p>
        <p className="text-base text-foreground/80">Bấm để xem và nhận đơn ngay</p>
      </div>
    </Link>
  );
}

/** Onboarding card with simple 3 steps. Dismissible (local state). */
export function OnboardingCard() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const steps = [
    "Khi có đơn mới, bấm nút lớn màu xanh để Nhận đơn.",
    "Soạn hàng xong thì bấm Đã sẵn sàng để báo tài xế đến lấy.",
    "Trao hàng cho tài xế và bấm Đã giao tài xế là xong!",
  ];
  return (
    <div className="mx-4 mt-4 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">👋</span>
          <p className="text-lg font-extrabold">Hướng dẫn xử lý đơn đầu tiên</p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Đóng" className="grid h-9 w-9 place-items-center rounded-full active:bg-muted"><X className="h-5 w-5" /></button>
      </div>
      <ol className="mt-3 space-y-2.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">{i + 1}</span>
            <span className="pt-1 text-base leading-snug">{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-xl bg-card p-3 text-sm text-muted-foreground">
        Nếu cần trợ giúp, gọi tổng đài <span className="font-bold text-foreground">1900 6868</span>, lúc nào cũng có người nghe máy.
      </p>
    </div>
  );
}

/** Quick price update modal — single field, large keypad-friendly input. */
export function QuickPriceModal({ productName, currentPrice, unit, open, onOpenChange, onSave }: {
  productName: string;
  currentPrice: number;
  unit: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave?: (newPrice: number) => void;
}) {
  const [value, setValue] = useState(String(currentPrice));
  const save = () => {
    const n = Number(value);
    if (!n || n < 1000) { toast.error("Giá phải lớn hơn 1.000 đ"); return; }
    onSave?.(n);
    toast.success(`Đã cập nhật giá ${productName}`);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Sửa giá nhanh</DialogTitle>
          <p className="text-base text-muted-foreground">{productName}</p>
        </DialogHeader>
        <div className="py-2">
          <label className="mb-2 block text-base font-semibold">Giá mới (đồng / {unit})</label>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-16 w-full rounded-2xl border-2 bg-card px-4 text-2xl font-extrabold tracking-wide outline-none focus:border-primary"
            autoFocus
          />
          <p className="mt-2 text-sm text-muted-foreground">Giá hiện tại: {formatVnd(currentPrice)} / {unit}</p>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          <button onClick={() => onOpenChange(false)} className="h-14 rounded-2xl border-2 text-base font-bold">Huỷ</button>
          <button onClick={save} className="h-14 rounded-2xl bg-primary text-base font-extrabold text-primary-foreground">Lưu giá mới</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Big rounded action button — primary CTA used across vendor pages. */
export function BigActionButton({ children, onClick, variant = "primary", as, to, disabled, full = true }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "success";
  as?: "button" | "link";
  to?: string;
  disabled?: boolean;
  full?: boolean;
}) {
  const cls: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    outline: "border-2 bg-card text-foreground",
    danger: "border-2 border-destructive/40 bg-destructive/5 text-destructive",
  };
  const base = `h-16 rounded-2xl text-lg font-extrabold active:scale-[0.98] disabled:opacity-50 ${full ? "w-full" : ""} ${cls[variant]}`;
  if (as === "link" && to) return <Link to={to as any} className={`grid place-items-center ${base}`}>{children}</Link>;
  return <button onClick={onClick} disabled={disabled} className={base}>{children}</button>;
}

export function CallButton({ phone }: { phone: string }) {
  return (
    <a href={`tel:${phone}`} className="grid h-16 w-16 place-items-center rounded-2xl border-2 bg-card active:scale-95" aria-label="Gọi điện">
      <Phone className="h-7 w-7 text-primary" />
    </a>
  );
}
