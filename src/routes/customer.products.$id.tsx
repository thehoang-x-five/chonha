import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Sparkles } from "lucide-react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { getProduct, getStall, formatVnd } from "@/lib/mock-data";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/products/$id")({
  component: Page,
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
});

const qtyChoices = [0.5, 1, 1.5];
const replaceOpts = [
  { id: "ask", label: "Gọi tôi trước khi thay" },
  { id: "auto", label: "Cho phép thay sản phẩm tương tự" },
  { id: "refund", label: "Không thay, hoàn tiền món này" },
];

function Page() {
  const product = Route.useLoaderData();
  const stall = getStall(product.stallId)!;
  const nav = useNavigate();
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState(false);
  const [prep, setPrep] = useState(product.prepOptions?.[0]);
  const [replace, setReplace] = useState("auto");
  const [note, setNote] = useState("");

  const total = product.price * qty;

  const add = () => {
    const r = cart.add({ productId: product.id, stallId: product.stallId, marketId: stall.marketId, qty, prep, note, replacement: replace });
    if (!r.ok) { toast.error(r.reason!); return; }
    toast.success(`Đã thêm ${product.name} vào giỏ`);
    nav({ to: "/customer/cart" });
  };

  return (
    <MobileShell padBottom={false}>
      <AppHeader title={product.name} back={true} />
      <div className="grid aspect-square place-items-center bg-gradient-to-br from-accent to-muted text-[8rem]">{product.image}</div>
      <div className="px-4 pt-4 pb-32">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="mt-1 text-2xl font-extrabold text-primary">{formatVnd(product.price)}<span className="text-sm font-medium text-muted-foreground">/{product.unit}</span></p>
        {product.freshNote && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <Sparkles className="h-3 w-3" /> {product.freshNote}
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">Bán tại <span className="font-semibold text-foreground">{stall.name}</span></p>

        <section className="mt-5">
          <h3 className="text-sm font-semibold">Khối lượng</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {qtyChoices.map(q => (
              <button key={q} onClick={() => { setCustom(false); setQty(q); }} className={`rounded-full border px-4 py-2 text-sm font-semibold ${!custom && qty === q ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{q} {product.unit}</button>
            ))}
            <button onClick={() => setCustom(true)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${custom ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>Tuỳ chọn</button>
          </div>
          {custom && (
            <div className="mt-2 inline-flex items-center gap-3 rounded-full border bg-card px-2">
              <button onClick={() => setQty(Math.max(0.1, +(qty - 0.1).toFixed(2)))} className="tap-target grid place-items-center"><Minus className="h-4 w-4" /></button>
              <span className="min-w-[60px] text-center text-sm font-semibold">{qty.toFixed(1)} {product.unit}</span>
              <button onClick={() => setQty(+(qty + 0.1).toFixed(2))} className="tap-target grid place-items-center"><Plus className="h-4 w-4" /></button>
            </div>
          )}
        </section>

        {product.prepOptions && (
          <section className="mt-5">
            <h3 className="text-sm font-semibold">Cách sơ chế</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {product.prepOptions.map((o: string) => (
                <button key={o} onClick={() => setPrep(o)} className={`rounded-2xl border px-3 py-2.5 text-sm font-medium ${prep === o ? "border-primary bg-primary/10 text-primary" : "bg-card"}`}>{o}</button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h3 className="text-sm font-semibold">Nếu hết hàng</h3>
          <div className="mt-2 space-y-2">
            {replaceOpts.map(o => (
              <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${replace === o.id ? "border-primary bg-primary/5" : "bg-card"}`}>
                <input type="radio" checked={replace === o.id} onChange={() => setReplace(o.id)} className="h-4 w-4 accent-[color:var(--primary)]" />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-semibold">Ghi chú cho sạp</h3>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: chọn cá vừa, cắt 4 khúc" rows={3} className="mt-2 w-full rounded-2xl border bg-card p-3 text-sm outline-none focus:border-primary" />
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3 safe-bottom">
        <button onClick={add} className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-base font-bold text-primary-foreground active:scale-[0.98]">
          <span>Thêm vào giỏ</span>
          <span>{formatVnd(total)}</span>
        </button>
      </div>
    </MobileShell>
  );
}
