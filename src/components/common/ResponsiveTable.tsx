import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Hide this column on mobile card view (still shown in desktop table). */
  desktopOnly?: boolean;
  className?: string;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Render the mobile card title (first/primary line). */
  mobileTitle?: (row: T) => ReactNode;
}

/** Renders a real table on ≥md screens, stacked cards on mobile so admin
 *  data is readable on phones without horizontal scroll. */
export function ResponsiveTable<T>({
  rows,
  columns,
  rowKey,
  empty,
  onRowClick,
  mobileTitle,
}: Props<T>) {
  if (!rows.length) {
    return <div className="px-4 py-8 text-center text-sm text-muted-foreground">{empty ?? "Không có dữ liệu"}</div>;
  }
  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b last:border-b-0 ${onRowClick ? "cursor-pointer hover:bg-muted/40" : ""}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-2 px-3 py-2 md:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`rounded-2xl border bg-card p-3 ${onRowClick ? "active:scale-[0.99]" : ""}`}
          >
            {mobileTitle && (
              <p className="mb-2 truncate text-sm font-semibold">{mobileTitle(row)}</p>
            )}
            <dl className="space-y-1 text-sm">
              {columns
                .filter((c) => !c.desktopOnly)
                .map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.header}</dt>
                    <dd className="min-w-0 text-right">{c.render(row)}</dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
