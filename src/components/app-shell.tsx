import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export function AppHeader({ title, back, right, subtitle, sticky = true }: { title: string; subtitle?: string; back?: string | true; right?: ReactNode; sticky?: boolean }) {
  return (
    <header className={`${sticky ? "sticky top-0 z-30" : ""} safe-top border-b bg-card/95 backdrop-blur`}>
      <div className="flex h-14 items-center gap-2 px-3">
        {back && (
          back === true
            ? <button onClick={() => history.back()} className="tap-target -ml-2 grid place-items-center rounded-full"><ArrowLeft className="h-5 w-5" /></button>
            : <Link to={back as string} className="tap-target -ml-2 grid place-items-center rounded-full"><ArrowLeft className="h-5 w-5" /></Link>
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

export function MobileShell({ children, nav, padBottom = true }: { children: ReactNode; nav?: ReactNode; padBottom?: boolean }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className={padBottom ? "pb-24" : ""}>{children}</div>
      {nav}
    </div>
  );
}
