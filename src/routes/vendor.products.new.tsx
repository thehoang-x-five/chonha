import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { categories } from "@/lib/mock-data";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor/products/new")({ component: Page });

function Page() {
  const nav = useNavigate();
  const save = () => { toast.success("Đã lưu sản phẩm"); nav({ to: "/vendor/products" }); };
  return (
    <MobileShell>
      <AppHeader title="Thêm sản phẩm" back="/vendor/products" />
      <form className="space-y-4 px-4 pt-4 pb-10" onSubmit={e => { e.preventDefault(); save(); }}>
        <Field label="Tên sản phẩm"><input className="input" placeholder="Ví dụ: Cá thu tươi" /></Field>
        <Field label="Danh mục">
          <select className="input">{categories.map(c => <option key={c.name}>{c.name}</option>)}</select>
        </Field>
        <Field label="Giá (đ)"><input type="number" className="input" placeholder="145000" /></Field>
        <Field label="Đơn vị">
          <select className="input"><option>kg</option><option>bó</option><option>con</option><option>phần</option><option>chai</option></select>
        </Field>
        <Field label="Tình trạng">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-base"><input type="radio" name="s" defaultChecked className="h-4 w-4" /> Còn hàng</label>
            <label className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-base"><input type="radio" name="s" className="h-4 w-4" /> Hết hàng</label>
          </div>
        </Field>
        <Field label="Hình ảnh">
          <button type="button" className="flex h-32 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-card text-sm text-muted-foreground">
            <Upload className="h-5 w-5" /> Tải ảnh sản phẩm
          </button>
        </Field>
        <Field label="Tuỳ chọn sơ chế (mỗi dòng một mục)">
          <textarea rows={3} className="input" placeholder={"Để nguyên con\nLàm sạch\nCắt khúc"} />
        </Field>
        <button className="h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground">Lưu sản phẩm</button>
        <style>{`.input { width: 100%; height: 52px; border-radius: 16px; border: 1px solid var(--border); background: var(--card); padding: 0 14px; font-size: 16px; outline: none; }
          textarea.input { height: auto; padding: 12px 14px; }`}</style>
      </form>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}
