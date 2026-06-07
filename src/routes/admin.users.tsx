import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ResponsiveTable } from "@/components/common/ResponsiveTable";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { mockUsers } from "@/mocks/mockUsers";

export const Route = createFileRoute("/admin/users")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const rows = mockUsers.filter((u) => !q || u.name?.toLowerCase().includes(q.toLowerCase()) || u.phone?.includes(q));
  return (
    <AdminShell title="Người dùng" subtitle="Khách hàng, chủ gian hàng, tài xế">
      <div className="border-b bg-card">
        <SearchFilterBar value={q} onChange={setQ} placeholder="Tìm theo tên, SĐT…" />
      </div>
      <ResponsiveTable
        rows={rows}
        rowKey={(u) => u.id}
        mobileTitle={(u) => u.name}
        columns={[
          { key: "name", header: "Họ tên", render: (u) => u.name, desktopOnly: true },
          { key: "phone", header: "SĐT", render: (u) => u.phone ?? "—" },
          { key: "role", header: "Vai trò", render: (u) => <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{u.role}</span> },
        ]}
        empty="Không có người dùng"
      />
    </AdminShell>
  );
}
