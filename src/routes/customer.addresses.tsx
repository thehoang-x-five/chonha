import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAddresses } from "@/hooks/useAddresses";
import { MapPin, Plus, Star, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/addresses")({ component: AddressesPage });

function AddressesPage() {
  const { data, add, update, remove, setDefault } = useAddresses();
  const [form, setForm] = useState<null | { id?: string; label: string; fullName: string; phone: string; address: string }>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form) return;
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (form.id) await update(form.id, form);
    else await add({ ...form, isDefault: data.length === 0 });
    toast.success(form.id ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ mới");
    setForm(null);
  };

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader
        title="Sổ địa chỉ"
        back="/customer/profile"
        right={
          <button
            type="button"
            onClick={() => setForm({ label: "Nhà", fullName: "", phone: "", address: "" })}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-95"
          >
            <Plus className="mr-1 inline h-3.5 w-3.5" /> Thêm
          </button>
        }
      />

      {data.length === 0 && !form ? (
        <EmptyState
          icon={<MapPin className="h-7 w-7" />}
          title="Chưa có địa chỉ nào"
          description="Thêm địa chỉ giao hàng để đặt nhanh hơn."
          action={
            <button
              type="button"
              onClick={() => setForm({ label: "Nhà", fullName: "", phone: "", address: "" })}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Thêm địa chỉ
            </button>
          }
        />
      ) : (
        <ul className="space-y-2 p-3">
          {data.map((a) => (
            <li key={a.id} className="rounded-2xl border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">{a.label}</span>
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary">
                        <Star className="h-3 w-3 fill-primary" /> Mặc định
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold">{a.fullName} · {a.phone}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.address}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(a.id).then(() => toast.success("Đã đặt làm mặc định"))}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold active:bg-muted"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setForm({ id: a.id, label: a.label, fullName: a.fullName, phone: a.phone, address: a.address })}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold active:bg-muted"
                >
                  <Pencil className="mr-1 inline h-3 w-3" /> Sửa
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(a.id)}
                  className="ml-auto rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive active:bg-destructive/10"
                >
                  <Trash2 className="mr-1 inline h-3 w-3" /> Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm" onClick={() => setForm(null)}>
          <div
            className="w-full max-w-md mx-auto rounded-t-3xl bg-card p-4 safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold">{form.id ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Nhãn</label>
                <div className="mt-1 flex gap-2">
                  {["Nhà", "Công ty", "Khác"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setForm({ ...form, label: l })}
                      className={`rounded-full border px-3 py-1.5 text-sm ${form.label === l ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Người nhận</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
                  placeholder="Tên người nhận"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Số điện thoại</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  inputMode="tel"
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
                  placeholder="09xx xxx xxx"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Địa chỉ chi tiết</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="flex-1 rounded-full border py-3 text-sm font-semibold"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Xoá địa chỉ này?"
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        destructive
        onConfirm={async () => {
          if (confirmId) {
            await remove(confirmId);
            toast.success("Đã xoá địa chỉ");
            setConfirmId(null);
          }
        }}
      />
    </PageShell>
  );
}
