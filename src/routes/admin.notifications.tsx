import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notifications")({ component: Page });

function Page() {
  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!form.title.trim() || !form.message.trim()) return toast.error("Vui lòng điền đầy đủ");
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    setSending(false);
    toast.success(`Đã gửi thông báo đến ${form.audience === "all" ? "tất cả người dùng" : form.audience}`);
    setForm({ title: "", message: "", audience: "all" });
  };

  return (
    <AdminShell title="Gửi thông báo" subtitle="Push tới khách hàng / chủ gian / tài xế">
      <div className="mx-auto max-w-2xl space-y-3 p-4">
        <div className="rounded-2xl border bg-card p-4">
          <label className="text-xs font-semibold text-muted-foreground">Tiêu đề</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
            placeholder="Khuyến mãi cuối tuần"
          />
          <label className="mt-3 block text-xs font-semibold text-muted-foreground">Nội dung</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          <label className="mt-3 block text-xs font-semibold text-muted-foreground">Đối tượng</label>
          <select
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
          >
            <option value="all">Tất cả người dùng</option>
            <option value="customer">Khách hàng</option>
            <option value="vendor">Chủ gian hàng</option>
            <option value="driver">Tài xế</option>
          </select>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {sending ? "Đang gửi…" : "Gửi thông báo"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
