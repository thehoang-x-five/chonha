import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { DriverBottomNav } from "@/components/bottom-nav";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/driver/issues")({ component: Page });

const REASONS = [
  "Gian hàng chưa chuẩn bị xong",
  "Khách không nghe máy",
  "Không tìm thấy địa chỉ",
  "Hàng bị thiếu hoặc sai",
  "Sự cố xe / khác",
];

function Page() {
  const navigate = useNavigate();
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!reason) return toast.error("Chọn lý do trước");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    toast.success("Đã gửi báo cáo, điều phối sẽ liên hệ bạn");
    navigate({ to: "/driver/home" });
  };

  return (
    <MobileShell area="driver" nav={<DriverBottomNav />}>
      <AppHeader title="Báo cáo sự cố" back={true} />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-warning/10 p-3 text-warning-foreground">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <p className="text-sm">Chọn vấn đề bạn đang gặp phải để điều phối hỗ trợ nhanh nhất.</p>
        </div>
        <ul className="space-y-2">
          {REASONS.map((r) => (
            <li key={r}>
              <button
                type="button"
                onClick={() => setReason(r)}
                className={`w-full rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium ${
                  reason === r ? "border-primary ring-2 ring-primary/30" : ""
                }`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Mô tả thêm (tuỳ chọn)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {submitting ? "Đang gửi…" : "Gửi báo cáo"}
        </button>
      </div>
    </MobileShell>
  );
}
