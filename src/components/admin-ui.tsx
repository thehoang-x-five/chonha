import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function AdminKPI({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { dir: "up" | "down"; value: string };
  icon: LucideIcon;
  accent?: "primary" | "success" | "info" | "warning" | "destructive";
}) {
  const tone: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/15 text-destructive",
  };
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", tone[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-bold",
              trend.dir === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
            )}
          >
            {trend.dir === "up" ? "▲" : "▼"} {trend.value}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-bold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AreaChart({ data, labels, color = "primary" }: { data: number[]; labels: string[]; color?: "primary" | "success" | "info" }) {
  const max = Math.max(...data, 1);
  const w = 600;
  const h = 180;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - (v / max) * (h - 20) - 10] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const stroke = color === "primary" ? "stroke-primary" : color === "success" ? "stroke-success" : "stroke-info";
  const fill = color === "primary" ? "fill-primary" : color === "success" ? "fill-success" : "fill-info";
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none">
        <path d={area} className={cn(fill, "opacity-15")} />
        <path d={line} className={cn(stroke, "fill-none")} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" className={cn(fill)} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] font-semibold text-muted-foreground">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-bold text-primary">{value}/{max}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-muted">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-info" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
