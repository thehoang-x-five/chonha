import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { VendorHeader, QuickPriceModal } from "@/components/vendor";
import { formatVnd } from "@/lib/mock-data";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product.types";
import { Plus, Pencil, Image as ImageIcon, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { notifyTodo } from "@/lib/notify";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/vendor/products")({ component: Page });

const STALL_ID = "s1";

function Page() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "in" | "out">("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const refetch = () => productService.getProductsByStall(STALL_ID).then(setItems);
  useEffect(() => { refetch(); }, []);

  const toggleStock = async (p: Product) => {
    try {
      await productService.toggleAvailability(p.id, !p.isAvailable);
      toast.success(p.isAvailable ? "Đã báo hết hàng" : "Đã báo còn hàng");
      refetch();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Cập nhật thất bại"); }
  };

  const savePrice = async (id: string, price: number) => {
    try { await productService.updatePrice(id, price); refetch(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Cập nhật giá thất bại"); }
  };

  const doDelete = async (p: Product) => {
    try {
      await productService.deleteProduct(p.id);
      toast.success(`Đã xoá ${p.name}`);
      setDeleting(null);
      refetch();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Xoá thất bại"); }
  };

  const filtered = items
    .filter((p) => tab === "all" || (tab === "in" && p.isAvailable) || (tab === "out" && !p.isAvailable))
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <MobileShell nav={<VendorBottomNav />} area="vendor">
      <VendorHeader title="Sản phẩm của tôi" subtitle="Bấm Sửa giá để đổi giá nhanh" />

      <div className="space-y-2 px-4 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm…" className="h-12 flex-1 bg-transparent text-base outline-none" />
        </div>
        <div className="flex gap-1 rounded-full border bg-card p-1 text-sm font-bold">
          {([["all", `Tất cả (${items.length})`], ["in", `Còn (${items.filter(p => p.isAvailable).length})`], ["out", `Hết (${items.filter(p => !p.isAvailable).length})`]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full py-2 ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-3 pb-28">
        {filtered.map((p) => (
          <li key={p.id} className="rounded-3xl border-2 bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-accent text-5xl">{p.image}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold leading-tight">{p.name}</p>
                <p className="mt-1 text-xl font-extrabold text-primary">
                  {formatVnd(p.price)}<span className="text-sm font-semibold text-muted-foreground"> / {p.unit}</span>
                </p>
              </div>
              <button
                onClick={() => toggleStock(p)}
                className={`h-12 shrink-0 rounded-full px-4 text-base font-extrabold ${p.isAvailable ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}
              >
                {p.isAvailable ? "Còn hàng" : "Hết hàng"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => setEditing(p)} className="flex h-14 items-center justify-center gap-1 rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground active:scale-[0.98]"><Pencil className="h-5 w-5" /> Sửa giá</button>
              <button onClick={() => notifyTodo("Đổi ảnh sản phẩm")} className="flex h-14 items-center justify-center gap-1 rounded-2xl border-2 bg-card text-sm font-bold"><ImageIcon className="h-5 w-5" /> Sửa ảnh</button>
              <button onClick={() => setDeleting(p)} className="flex h-14 items-center justify-center gap-1 rounded-2xl border-2 border-destructive/30 bg-destructive/5 text-sm font-bold text-destructive"><Trash2 className="h-5 w-5" /> Xoá</button>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-3xl border-2 border-dashed bg-card p-8 text-center text-base text-muted-foreground">Không có sản phẩm phù hợp</li>
        )}
      </ul>

      <Link
        to="/vendor/products/new"
        className="fixed bottom-24 left-1/2 z-30 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full bg-secondary px-6 text-base font-extrabold text-secondary-foreground shadow-lg active:scale-95"
      >
        <Plus className="h-6 w-6" /> Thêm sản phẩm
      </Link>

      {editing && (
        <QuickPriceModal
          open={!!editing}
          onOpenChange={(v) => !v && setEditing(null)}
          productName={editing.name}
          currentPrice={editing.price}
          unit={editing.unit}
          onSave={(n) => savePrice(editing.id, n)}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Sản phẩm sẽ không còn hiển thị cho khách. Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && doDelete(deleting)}>Xoá sản phẩm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}
