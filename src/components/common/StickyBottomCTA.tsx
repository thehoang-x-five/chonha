import { ReactNode } from "react";

/** Fixed bar pinned above the bottom nav (or the safe area when no nav).
 *  Pages using this should add `pb-32` to their main scroll area so
 *  content isn't hidden behind the bar. */
export function StickyBottomCTA({
  children,
  aboveNav = true,
  className = "",
}: {
  children: ReactNode;
  aboveNav?: boolean;
  className?: string;
}) {
  const bottomOffset = aboveNav
    ? "bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))]"
    : "bottom-0 safe-bottom";
  return (
    <div
      className={`fixed left-0 right-0 z-30 ${bottomOffset} mx-auto max-w-md border-t bg-card/95 px-4 py-3 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
