import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";
import type { AppArea } from "@/lib/permissions";

export function AppHeader({ title, back, right, subtitle, sticky = true }: { title: string; subtitle?: string; back?: string | true; right?: ReactNode; sticky?: boolean }) {
  return (
    <header className={`${sticky ? "sticky top-0 z-30" : ""} safe-top border-b bg-card/95 backdrop-blur`}>
      <div className="flex h-14 items-center gap-2 px-3 safe-x">
        {back && (
          back === true
            ? <button onClick={() => history.back()} aria-label="Quay lại" className="tap-target -ml-2 grid place-items-center rounded-full active:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            : <Link to={back as string} aria-label="Quay lại" className="tap-target -ml-2 grid place-items-center rounded-full active:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function MobileShell({ children, nav, padBottom = true, area }: { children: ReactNode; nav?: ReactNode; padBottom?: boolean; area?: AppArea }) {
  // Key off the pathname so each navigation re-triggers the enter animation.
  const path = useRouterState({ select: s => s.location.pathname });
  const inner = (
    <div className="mx-auto min-h-dvh max-w-md bg-background safe-x">
      <div key={path} className={`page-enter ${padBottom ? "pb-nav" : ""}`}>{children}</div>
      {nav}
    </div>
  );
  return area ? <RoleGuard area={area}>{inner}</RoleGuard> : inner;
}
