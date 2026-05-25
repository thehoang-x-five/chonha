import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "info" | "destructive" | "muted" | "primary" | "secondary";

const map: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-foreground border-warning/40",
  info: "bg-info/15 text-info border-info/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/15 text-primary border-primary/30",
  secondary: "bg-secondary/15 text-secondary border-secondary/30",
};

export function StatusBadge({ variant = "muted", children, className }: { variant?: Variant; children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", map[variant], className)}>{children}</span>;
}

import type { Order } from "@/lib/mock-data";
export const orderStatusLabel: Record<Order["status"], { label: string; variant: Variant }> = {
  confirmed: { label: "Đã xác nhận", variant: "info" },
  preparing: { label: "Đang chuẩn bị", variant: "warning" },
  finding_driver: { label: "Tìm tài xế", variant: "warning" },
  picking: { label: "Lấy hàng tại chợ", variant: "info" },
  delivering: { label: "Đang giao", variant: "info" },
  completed: { label: "Đã hoàn tất", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};
