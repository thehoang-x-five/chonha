import { ReactNode } from "react";

export function SectionTitle({
  title,
  action,
  description,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-3 px-4 pt-5 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
