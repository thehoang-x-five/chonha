import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ResponsiveTable } from "@/components/common/ResponsiveTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tickets")({ component: Page });

interface Ticket { id: string; subject: string; from: string; role: string; status: "open" | "resolved"; createdAt: string; }

const SEED: Ticket[] = [
  { id: "T-001", subject: "Đơn hàng chưa giao sau 2h", from: "Chị Mai", role: "customer", status: "open", createdAt: "2025-06-07T10:00:00" },
  { id: "T-002", subject: "Không nhận được tiền hoa hồng", from: "Cô Lan", role: "vendor", status: "open", createdAt: "2025-06-06T15:30:00" },
  { id: "T-003", subject: "Xe gặp sự cố giữa đường", from: "Anh Hùng", role: "driver", status: "resolved", createdAt: "2025-06-05T08:00:00" },
];

function Page() {
  const [tickets, setTickets] = useState(SEED);
  const [resolveId, setResolveId] = useState<string | null>(null);

  return (
    <AdminShell title="Phiếu hỗ trợ" subtitle="Yêu cầu từ người dùng">
      <ResponsiveTable
        rows={tickets}
        rowKey={(t) => t.id}
        mobileTitle={(t) => `${t.id} · ${t.subject}`}
        columns={[
          { key: "id", header: "Mã", render: (t) => <code>{t.id}</code>, desktopOnly: true },
          { key: "subject", header: "Nội dung", render: (t) => t.subject },
          { key: "from", header: "Người gửi", render: (t) => `${t.from} (${t.role})` },
          {
            key: "status",
            header: "Trạng thái",
            render: (t) => (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  t.status === "open" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                }`}
              >
                {t.status === "open" ? "Đang xử lý" : "Đã xử lý"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (t) =>
              t.status === "open" ? (
                <button
                  type="button"
                  onClick={() => setResolveId(t.id)}
                  className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                >
                  Đánh dấu xử lý
                </button>
              ) : null,
          },
        ]}
        empty="Không có phiếu hỗ trợ"
      />
      <ConfirmDialog
        open={!!resolveId}
        onOpenChange={(o) => !o && setResolveId(null)}
        title="Đánh dấu đã xử lý?"
        confirmLabel="Xác nhận"
        onConfirm={() => {
          setTickets((ts) => ts.map((t) => (t.id === resolveId ? { ...t, status: "resolved" } : t)));
          toast.success("Đã đóng phiếu hỗ trợ");
          setResolveId(null);
        }}
      />
    </AdminShell>
  );
}
