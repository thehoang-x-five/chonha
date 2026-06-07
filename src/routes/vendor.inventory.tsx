import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { useProductsByStall } from "@/hooks/useProducts";
import { EmptyState } from "@/components/common/EmptyState";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/formatCurrency";

export const Route = createFileRoute("/vendor/inventory")({ component: Page });

function Page() {
  const { user } = useAuth();
  const stallId = (user as any)?.stallId ?? "s1";
  const { data } = useProductsByStall(stallId);
  const lowStock = data.filter((p) => !p.isAvailable);
  return (
    <MobileShell area="vendor" nav={<VendorBottomNav />}>
      <AppHeader title="Tồn kho cần chú ý" back="/vendor/dashboard" />
      <div className="p-4">
        <div className="rounded-2xl border border-warning/50 bg-warning/10 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <p className="text-base font-bold">{lowStock.length} sản phẩm đang hết hàng</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Khách sẽ không thấy các sản phẩm này. Cập nhật trạng thái khi đã có hàng.</p>
        </div>
        {lowStock.length === 0 ? (
          <EmptyState title="Tất cả sản phẩm đang có hàng" description="Tuyệt vời!" />
        ) : (
          <ul className="mt-4 space-y-2">
            {lowStock.map((p) => (
              <li key={p.id} className="rounded-2xl border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{p.image ?? "🥬"}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(p.price)} / {p.unit}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}
