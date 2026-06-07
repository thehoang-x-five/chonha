import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/profile/edit")({ component: EditProfilePage });

function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name ?? "", phone: user.phone ?? "", email: (user as any).email ?? "" });
  }, [user]);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!/^0\d{8,10}$/.test(form.phone)) return toast.error("Số điện thoại không hợp lệ");
    setSaving(true);
    try {
      await authService.updateProfile({ name: form.name, phone: form.phone, ...(form.email ? { email: form.email } as any : {}) });
      toast.success("Đã cập nhật hồ sơ");
      navigate({ to: "/customer/profile" });
    } catch (e: any) {
      toast.error(e.message ?? "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title="Chỉnh sửa hồ sơ" back="/customer/profile" />
      <div className="space-y-4 p-4">
        <div className="grid place-items-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-3xl">👤</div>
          <button type="button" className="mt-2 text-xs font-semibold text-primary">Đổi ảnh đại diện</button>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Họ và tên</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Số điện thoại</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            inputMode="tel"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Email (tuỳ chọn)</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </PageShell>
  );
}
