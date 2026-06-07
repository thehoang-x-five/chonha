import { Search } from "lucide-react";
import { ReactNode } from "react";

export function SearchFilterBar({
  value,
  onChange,
  placeholder = "Tìm kiếm…",
  right,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <label className="flex h-11 flex-1 items-center gap-2 rounded-full border bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label={placeholder}
        />
      </label>
      {right}
    </div>
  );
}
