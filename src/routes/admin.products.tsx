import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { products, getStall } from "@/lib/mock-data";
import { formatVnd } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/admin/products")({ component: Page });

function Page() {
  return (
    <AdminShell title="Sản phẩm">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="p-3 text-left">Sản phẩm</th><th className="p-3 text-left">Gian hàng</th><th className="p-3 text-left">Giá</th><th className="p-3 text-left">Danh mục</th><th className="p-3 text-left">Tình trạng</th></tr>
          </thead>
          <tbody>
            {products.map(p => {
              const s = getStall(p.stallId)!;
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3"><span className="mr-2 text-xl">{p.image}</span><span className="font-semibold">{p.name}</span></td>
                  <td className="p-3 text-muted-foreground">{s.name}</td>
                  <td className="p-3 font-semibold">{formatVnd(p.price)}/{p.unit}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3"><StatusBadge variant={p.inStock ? "success" : "destructive"}>{p.inStock ? "Còn hàng" : "Hết hàng"}</StatusBadge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
