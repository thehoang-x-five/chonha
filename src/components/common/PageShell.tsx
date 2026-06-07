import { ReactNode } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";
import type { AppArea } from "@/lib/permissions";
import { useRouterState } from "@tanstack/react-router";

/** Mobile-first page shell. Wraps content in the standard 448px max-width
 *  column with safe-area side padding and replays the page-enter animation
 *  on every route change. Pass `area` to gate the page by role. */
export function PageShell({
  children,
  nav,
  area,
  padBottom = true,
  className = "",
}: {
  children: ReactNode;
  nav?: ReactNode;
  area?: AppArea;
  padBottom?: boolean;
  className?: string;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const inner = (
    <div className={`mx-auto min-h-dvh max-w-md bg-background safe-x ${className}`}>
      <div key={path} className={`page-enter ${padBottom ? "pb-nav" : ""}`}>
        {children}
      </div>
      {nav}
    </div>
  );
  return area ? <RoleGuard area={area}>{inner}</RoleGuard> : inner;
}
