import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

/** Sticky top header with optional back button + right slot. */
export function MobilePageHeader({
  title,
  subtitle,
  back,
  right,
  sticky = true,
}: {
  title: string;
  subtitle?: string;
  back?: string | true;
  right?: ReactNode;
  sticky?: boolean;
}) {
  return (
    <header
      className={`${sticky ? "sticky top-0 z-30" : ""} safe-top border-b bg-card/95 backdrop-blur`}
    >
      <div className="flex h-14 items-center gap-2 px-3 safe-x">
        {back &&
          (back === true ? (
            <button
              type="button"
              onClick={() => history.back()}
              aria-label="Quay lại"
              className="tap-target -ml-2 grid place-items-center rounded-full active:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Link
              to={back as string}
              aria-label="Quay lại"
              className="tap-target -ml-2 grid place-items-center rounded-full active:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ))}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
