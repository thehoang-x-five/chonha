import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useVouchers } from "@/hooks/useVouchers";
import { formatCurrency } from "@/lib/formatCurrency";
import { Ticket, Copy } from "lucide-react";
import { toast } from "sonner";
import type { Voucher } from "@/types/voucher.types";

export const Route = createFileRoute("/customer/vouchers")({ component: VouchersPage });

function VoucherCard({ v }: { v: Voucher }) {
  const expired = v.status === "expired";
  const used = v.status === "used";
  const dim = expired || used;
  return (
    <li
      className={`relative overflow-hidden rounded-2xl border bg-card p-4 ${dim ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{v.title}</p>
              <p className="text-[11px] text-muted-foreground">HSD: {new Date(v.expiresAt).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{v.description}</p>
          {v.minOrder && (
            <p className="mt-1 text-[11px] text-muted-foreground">Đơn tối thiểu {formatCurrency(v.minOrder)}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">
            {v.unit === "percent" ? `Giảm ${v.value}%` : `Giảm ${formatCurrency(v.value)}`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-dashed bg-muted px-2 py-1.5 text-xs font-bold">
          {v.code}
        </code>
        <button
          type="button"
          disabled={dim}
          onClick={() => {
            navigator.clipboard?.writeText(v.code);
            toast.success("Đã sao chép mã");
          }}
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          <Copy className="mr-1 inline h-3 w-3" /> Sao chép
        </button>
      </div>
    </li>
  );
}

function VouchersPage() {
  const { loading, available, used, expired } = useVouchers();
  const [tab, setTab] = useState<"available" | "used" | "expired">("available");
  const list = tab === "available" ? available : tab === "used" ? used : expired;

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title="Mã khuyến mãi" back="/customer/profile" />
      <div className="sticky top-14 z-20 border-b bg-background px-3 py-2">
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {([
            ["available", `Còn hiệu lực (${available.length})`],
            ["used", `Đã dùng (${used.length})`],
            ["expired", `Hết hạn (${expired.length})`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Ticket className="h-7 w-7" />}
          title={tab === "available" ? "Chưa có mã nào" : "Không có mã"}
          description={tab === "available" ? "Mã khuyến mãi mới sẽ xuất hiện ở đây." : undefined}
        />
      ) : (
        <ul className="space-y-2 p-3">
          {list.map((v) => (
            <VoucherCard key={v.id} v={v} />
          ))}
        </ul>
      )}
    </PageShell>
  );
}
