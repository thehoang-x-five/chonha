import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ResponsiveTable } from "@/components/common/ResponsiveTable";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useVouchers } from "@/hooks/useVouchers";
import { voucherService } from "@/services/voucherService";
import { formatCurrency } from "@/lib/formatCurrency";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vouchers")({ component: Page });

function Page() {
  const { data, refresh } = useVouchers();
  const [q, setQ] = useState("");
  const [expireId, setExpireId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = data.filter((v) => !q || v.code.toLowerCase().includes(q.toLowerCase()) || v.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminShell title="Mã khuyến mãi" subtitle="Quản lý voucher">
      <div className="border-b bg-card">
        <SearchFilterBar
          value={q}
          onChange={setQ}
          placeholder="Tìm mã, tiêu đề…"
          right={
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Tạo mã
            </button>
          }
        />
      </div>
      <ResponsiveTable
        rows={rows}
        rowKey={(v) => v.id}
        mobileTitle={(v) => `${v.code} · ${v.title}`}
        columns={[
          { key: "code", header: "Mã", render: (v) => <code className="font-bold">{v.code}</code> },
          { key: "title", header: "Tiêu đề", render: (v) => v.title, desktopOnly: true },
          {
            key: "value",
            header: "Giảm",
            render: (v) => (v.unit === "percent" ? `${v.value}%` : formatCurrency(v.value)),
          },
          { key: "exp", header: "HSD", render: (v) => new Date(v.expiresAt).toLocaleDateString("vi-VN") },
          {
            key: "status",
            header: "Trạng thái",
            render: (v) => (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  v.status === "available"
                    ? "bg-success/10 text-success"
                    : v.status === "used"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
                }`}
              >
                {v.status === "available" ? "Hiệu lực" : v.status === "used" ? "Đã dùng" : "Hết hạn"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (v) =>
              v.status === "available" ? (
                <button
                  type="button"
                  onClick={() => setExpireId(v.id)}
                  className="rounded-full border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive"
                >
                  Vô hiệu
                </button>
              ) : null,
          },
        ]}
        empty="Chưa có mã khuyến mãi"
      />
      <ConfirmDialog
        open={!!expireId}
        onOpenChange={(o) => !o && setExpireId(null)}
        title="Vô hiệu mã này?"
        description="Khách hàng sẽ không thể sử dụng mã sau khi vô hiệu."
        destructive
        confirmLabel="Vô hiệu"
        onConfirm={async () => {
          if (expireId) {
            await voucherService.setStatus(expireId, "expired");
            toast.success("Đã vô hiệu mã");
            setExpireId(null);
            refresh();
          }
        }}
      />

      {creating && <CreateVoucherModal onClose={() => { setCreating(false); refresh(); }} />}
    </AdminShell>
  );
}

function CreateVoucherModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ code: "", title: "", description: "", value: 10, unit: "percent" as const, expiresAt: "2026-12-31" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.code.trim() || !form.title.trim()) return toast.error("Điền mã và tiêu đề");
    setSaving(true);
    try {
      await voucherService.create({ ...form, type: "discount", status: "available", scope: "all" });
      toast.success("Đã tạo mã khuyến mãi");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">Tạo mã khuyến mãi</h2>
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
            placeholder="Mã (vd: SALE50)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          />
          <input
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
            rows={2}
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className="rounded-xl border bg-background px-3 py-2 text-sm"
              placeholder="Giá trị"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
            <select
              className="rounded-xl border bg-background px-3 py-2 text-sm"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value as any })}
            >
              <option value="percent">%</option>
              <option value="fixed">VND</option>
            </select>
          </div>
          <input
            type="date"
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border py-2.5 text-sm font-semibold">Huỷ</button>
          <button type="button" onClick={save} disabled={saving} className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? "Đang lưu…" : "Tạo mã"}
          </button>
        </div>
      </div>
    </div>
  );
}
