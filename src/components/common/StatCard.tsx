import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  trend,
  className = "",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-card p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="mt-2 text-xl font-extrabold tracking-tight">{value}</p>
      {trend && (
        <p
          className={`mt-1 text-xs font-semibold ${
            trend.positive ? "text-success" : "text-destructive"
          }`}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}
