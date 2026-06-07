import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/common/EmptyState";
import { MessageCircle } from "lucide-react";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/vendor/messages")({ component: Page });

const MOCK = [
  { id: "m1", from: "Chị Mai", last: "Cá thu còn không chị?", time: "10 phút trước", unread: true },
  { id: "m2", from: "Anh Khoa", last: "Cho mình đặt 2kg rau muống", time: "1 giờ trước", unread: false },
  { id: "m3", from: "Cô Bảy", last: "Cảm ơn em nhé!", time: "Hôm qua", unread: false },
];

function Page() {
  return (
    <MobileShell area="vendor" nav={<VendorBottomNav />}>
      <AppHeader title="Tin nhắn khách" back="/vendor/dashboard" />
      {MOCK.length === 0 ? (
        <EmptyState icon={<MessageCircle className="h-7 w-7" />} title="Chưa có tin nhắn" />
      ) : (
        <ul className="divide-y border-y bg-card">
          {MOCK.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => notifyTodo("Mở hộp thoại")}
                className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-muted"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-xl">👤</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-base font-bold">{m.from}</p>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{m.last}</p>
                </div>
                {m.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </MobileShell>
  );
}
