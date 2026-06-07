import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/formatCurrency";
import { Tag } from "lucide-react";

export const Route = createFileRoute("/customer/category/$slug")({ component: CategoryPage });

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data = [] } = useProducts();
  const filtered = useMemo(
    () => data.filter((p) => (p.category ?? "").toLowerCase() === decodeURIComponent(slug).toLowerCase()),
    [data, slug],
  );
  const title = decodeURIComponent(slug);

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title={title} subtitle={`${filtered.length} sản phẩm`} back="/customer/home" />
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-7 w-7" />}
          title="Chưa có sản phẩm"
          description="Danh mục này đang được cập nhật."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 p-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link
                to="/customer/products/$id"
                params={{ id: p.id }}
                className="block overflow-hidden rounded-2xl border bg-card active:scale-[0.98]"
              >
                <div className="grid aspect-square place-items-center bg-muted text-5xl">{p.image ?? "🥬"}</div>
                <div className="p-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.unit}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{formatCurrency(p.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
