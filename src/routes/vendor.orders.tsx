import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { VendorHeader, BigStatus } from "@/components/vendor";
import { orders, getProduct, formatVnd } from "@/lib/mock-data";
import { Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/vendor/orders")({ component: Page });

type Tab = "new" | "doing" | "done";

function Page() {
  const [tab, setTab] = useState<Tab>("new");
  const all = orders.filter(o => o.items.some(i => i.stallId === "s1"));

  const groups: Record<Tab, typeof all> = {
    new: all.filter(o => o.status === "confirmed"),
    doing: all.filter(o => ["preparing", "finding_driver", "picking"].includes(o.status)),
    done: all.filter(o => ["delivering", "completed", "cancelled"].includes(o.status)),
  };
  // demo padding: if "new" is empty, show first preparing
  if (groups.new.length === 0 && groups.doing.length > 0) groups.new = [groups.doing[0]];

  const list = groups[tab];

  return (
    <MobileShell nav={<VendorBottomNav />}>
      <VendorHeader title="Đơn hàng" subtitle="Bấm để xử lý từng đơn" />

      {/* Big tabs */}
      <div className="sticky top-16 z-20 grid grid-cols-3 gap-1 border-b bg-card px-3 pb-2 pt-3">
        {[
          { k: "new", l: `Mới (${groups.new.length})` },
          { k: "doing", l: `Đang làm (${groups.doing.length})` },
          { k: "done", l: "Đã xong" },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as Tab)}
            className={`h-12 rounded-2xl text-base font-extrabold ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="space-y-4 px-4 pt-4 pb-6">
        {list.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed bg-card p-10 text-center">
            <div className="text-5xl">🌿</div>
            <p className="mt-3 text-lg font-bold">Chưa có đơn nào ở đây</p>
            <p className="mt-1 text-sm text-muted-foreground">Khi có đơn mới, máy sẽ kêu báo cho cô biết.</p>
          </div>
        )}

        {list.map(o => {
          const myItems = o.items.filter(i => i.stallId === "s1");
          const isNew = o.status === "confirmed";
          const statusEl =
            o.status === "confirmed" ? <BigStatus variant="new">Đơn mới</BigStatus>
            : o.status === "preparing" ? <BigStatus variant="preparing">Đang chuẩn bị</BigStatus>
            : o.status === "finding_driver" ? <BigStatus variant="ready">Đã sẵn sàng</BigStatus>
            : o.status === "picking" ? <BigStatus variant="ready">Tài xế đang đến</BigStatus>
            : o.status === "delivering" ? <BigStatus variant="handed">Đã giao tài xế</BigStatus>
            : o.status === "completed" ? <BigStatus variant="done">Hoàn tất</BigStatus>
            : <BigStatus variant="cancelled">Đã huỷ</BigStatus>;
          return (
            <div key={o.id} className={`rounded-3xl border-2 bg-card p-4 ${isNew ? "border-secondary shadow-md" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xl font-extrabold">{o.customer}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    #{o.code} · {new Date(o.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {statusEl}
              </div>

              <ul className="mt-3 space-y-2 rounded-2xl bg-muted/60 p-3">
                {myItems.map(i => {
                  const p = getProduct(i.productId)!;
                  return (
                    <li key={i.productId} className="flex items-center gap-3 text-base">
                      <span className="text-2xl">{p.image}</span>
                      <span className="flex-1 font-semibold">{p.name}</span>
                      <span className="rounded-full bg-card px-3 py-1 text-base font-extrabold">{i.qty} {p.unit}</span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-base">
                Tổng tiền hàng: <span className="font-extrabold text-primary">{formatVnd(myItems.reduce((s, i) => s + (getProduct(i.productId)?.price || 0) * i.qty, 0))}</span>
              </p>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <Link
                  to="/vendor/orders/$id"
                  params={{ id: o.id }}
                  className="grid h-14 place-items-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground active:scale-[0.98]"
                >
                  {isNew ? "Nhận đơn này" : "Xem & xử lý"}
                </Link>
                <a href={`tel:${o.customerPhone}`} className="grid h-14 w-14 place-items-center rounded-2xl border-2 bg-card" aria-label="Gọi khách">
                  <Phone className="h-6 w-6 text-primary" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
