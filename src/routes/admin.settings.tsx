import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin-ui";
import { useAppSettings } from "@/hooks/useAppSettings";
import { adminService, type AppSettings } from "@/services/adminService";
import { validatePrice, validatePhone, validatePercent, validateRequired } from "@/lib/validators";
import { toast } from "sonner";
import { RefreshCw, Save, AlertTriangle } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  const { data, save, loading } = useAppSettings();
  const [form, setForm] = useState<AppSettings>(data);
  const [busy, setBusy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => { setForm(data); }, [data]);

  const onSave = async () => {
    // Validate
    for (const [v, label] of [
      [validatePrice(form.deliveryFeeBase), "Phí giao hàng cơ bản"],
      [validatePrice(form.serviceFee), "Phí dịch vụ"],
      [validatePercent(form.platformCommissionPercent), "Hoa hồng nền tảng"],
      [validatePercent(form.driverCommissionPercent), "Hoa hồng tài xế"],
      [validatePhone(form.supportHotline.replace(/\s/g, "")), "Hotline"],
      [validateRequired(form.voucherCode, "Mã voucher"), "Mã voucher"],
      [validatePercent(form.voucherDiscountPercent), "% giảm giá voucher"],
    ] as const) {
      if (!v.ok) { toast.error(`${label}: ${v.message}`); return; }
    }
    setBusy(true);
    try {
      await save(form);
      toast.success("Đã lưu cấu hình hệ thống");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lưu thất bại");
    } finally { setBusy(false); }
  };

  const doReset = async () => {
    await adminService.resetDemoData();
    setResetOpen(false);
    toast.success("Đã khôi phục dữ liệu demo. Đang tải lại…");
    setTimeout(() => window.location.reload(), 600);
  };

  if (loading) return <AdminShell title="Cấu hình"><p>Đang tải…</p></AdminShell>;

  return (
    <AdminShell title="Cấu hình" subtitle="Phí, hoa hồng, voucher, hotline" actions={
      <button onClick={onSave} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" /> {busy ? "Đang lưu…" : "Lưu cấu hình"}</button>
    }>
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Phí giao hàng & dịch vụ">
          <Field label="Phí giao hàng cơ bản (đ)" type="number" value={form.deliveryFeeBase} onChange={(v) => setForm({ ...form, deliveryFeeBase: Number(v) })} />
          <Field label="Phí dịch vụ (đ)" type="number" value={form.serviceFee} onChange={(v) => setForm({ ...form, serviceFee: Number(v) })} />
        </SectionCard>

        <SectionCard title="Hoa hồng nền tảng">
          <Field label="Hoa hồng gian hàng (%)" type="number" value={form.platformCommissionPercent} onChange={(v) => setForm({ ...form, platformCommissionPercent: Number(v) })} />
          <Field label="Hoa hồng tài xế (%)" type="number" value={form.driverCommissionPercent} onChange={(v) => setForm({ ...form, driverCommissionPercent: Number(v) })} />
        </SectionCard>

        <SectionCard title="Voucher khuyến mãi">
          <Field label="Mã voucher" value={form.voucherCode} onChange={(v) => setForm({ ...form, voucherCode: String(v).toUpperCase() })} />
          <Field label="% giảm giá" type="number" value={form.voucherDiscountPercent} onChange={(v) => setForm({ ...form, voucherDiscountPercent: Number(v) })} />
        </SectionCard>

        <SectionCard title="Liên hệ hỗ trợ">
          <Field label="Hotline" value={form.supportHotline} onChange={(v) => setForm({ ...form, supportHotline: String(v) })} />
        </SectionCard>

        <SectionCard title="Khu vực nguy hiểm" className="lg:col-span-2">
          <div className="flex items-start gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-bold text-destructive">Khôi phục dữ liệu demo</p>
              <p className="text-sm text-muted-foreground">Xoá toàn bộ giỏ hàng, đơn đã tạo, sạp đã theo dõi, cài đặt — đưa ứng dụng về trạng thái ban đầu của bản demo.</p>
              <button onClick={() => setResetOpen(true)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground"><RefreshCw className="h-4 w-4" /> Khôi phục dữ liệu demo</button>
            </div>
          </div>
        </SectionCard>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục dữ liệu demo?</AlertDialogTitle>
            <AlertDialogDescription>Toàn bộ trạng thái lưu trong trình duyệt sẽ bị xoá và ứng dụng được tải lại.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={doReset}>Khôi phục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (v: string | number) => void; type?: "text" | "number" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
