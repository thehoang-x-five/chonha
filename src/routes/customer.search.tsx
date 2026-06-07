import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search as SearchIcon, Store, ShoppingBag, MapPin } from "lucide-react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useMarkets } from "@/hooks/useMarkets";
import { useStalls } from "@/hooks/useStalls";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/formatCurrency";

export const Route = createFileRoute("/customer/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const { data: markets = [] } = useMarkets();
  const { data: stalls = [] } = useStalls();
  const { data: products = [] } = useProducts();

  const term = q.trim().toLowerCase();
  const m = useMemo(
    () => (term ? markets.filter((x) => x.name.toLowerCase().includes(term) || x.address?.toLowerCase().includes(term)) : []),
    [markets, term],
  );
  const s = useMemo(
    () => (term ? stalls.filter((x) => x.name.toLowerCase().includes(term) || x.specialty?.toLowerCase().includes(term)) : []),
    [stalls, term],
  );
  const p = useMemo(
    () => (term ? products.filter((x) => x.name.toLowerCase().includes(term)) : []),
    [products, term],
  );

  const total = m.length + s.length + p.length;

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title="Tìm kiếm" back="/customer/home" />
      <div className="sticky top-14 z-20 bg-background px-4 py-3">
        <label className="flex h-12 items-center gap-2 rounded-2xl border bg-card px-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm chợ, gian hàng, sản phẩm…"
            className="h-full flex-1 bg-transparent text-sm outline-none"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="text-xs text-muted-foreground">
              Xoá
            </button>
          )}
        </label>
      </div>

      {!term && (
        <div className="px-4 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gợi ý</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["cá thu", "rau muống", "thịt heo", "trái cây", "chợ Bến Thành"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setQ(t)}
                className="rounded-full border bg-card px-3 py-1.5 text-sm"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {term && total === 0 && (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" />}
          title={`Không có kết quả cho "${q}"`}
          description="Hãy thử từ khoá khác hoặc kiểm tra chính tả."
        />
      )}

      {term && m.length > 0 && (
        <section className="px-4 pt-2">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <MapPin className="h-4 w-4 text-primary" /> Chợ ({m.length})
          </h2>
          <ul className="space-y-2">
            {m.map((x) => (
              <li key={x.id}>
                <Link
                  to="/customer/markets/$id"
                  params={{ id: x.id }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 active:scale-[0.99]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-2xl">{x.cover ?? "🏪"}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{x.address}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">{x.distanceKm ?? "-"} km</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {term && s.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Store className="h-4 w-4 text-secondary" /> Gian hàng ({s.length})
          </h2>
          <ul className="space-y-2">
            {s.map((x) => (
              <li key={x.id}>
                <Link
                  to="/customer/stalls/$id"
                  params={{ id: x.id }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 active:scale-[0.99]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-2xl">{x.avatar ?? "🧺"}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{x.specialty}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {term && p.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShoppingBag className="h-4 w-4 text-primary" /> Sản phẩm ({p.length})
          </h2>
          <ul className="space-y-2">
            {p.map((x) => (
              <li key={x.id}>
                <Link
                  to="/customer/products/$id"
                  params={{ id: x.id }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 active:scale-[0.99]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{x.image ?? "🥬"}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{x.unit ?? ""}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{formatCurrency(x.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
