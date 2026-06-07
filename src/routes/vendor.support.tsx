import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, AppHeader } from "@/components/app-shell";
import { VendorBottomNav } from "@/components/bottom-nav";
import { Phone, MessageCircle, HelpCircle } from "lucide-react";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/vendor/support")({ component: Page });

function Page() {
  return (
    <MobileShell area="vendor" nav={<VendorBottomNav />}>
      <AppHeader title="Trợ giúp" back="/vendor/profile" />
      <div className="space-y-4 p-4">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <HelpCircle className="h-7 w-7" />
          <p className="mt-2 text-lg font-bold">Đội hỗ trợ chủ gian hàng</p>
          <p className="mt-1 text-sm opacity-90">Hỗ trợ đăng sản phẩm, doanh thu, thanh toán.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href="tel:19001234" className="flex items-center justify-center gap-2 rounded-full bg-card py-3 text-base font-bold text-foreground">
              <Phone className="h-5 w-5" /> Gọi ngay
            </a>
            <button
              type="button"
              onClick={() => notifyTodo("Chat hỗ trợ")}
              className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 text-base font-bold text-secondary-foreground"
            >
              <MessageCircle className="h-5 w-5" /> Chat
            </button>
          </div>
        </div>
        <ul className="space-y-2 text-base">
          <li className="rounded-2xl border bg-card p-4">
            <p className="font-bold">📦 Cách thêm sản phẩm mới</p>
            <p className="mt-1 text-sm text-muted-foreground">Vào "Sản phẩm" → bấm "Thêm mới" → điền tên, giá, ảnh.</p>
          </li>
          <li className="rounded-2xl border bg-card p-4">
            <p className="font-bold">💰 Khi nào nhận tiền?</p>
            <p className="mt-1 text-sm text-muted-foreground">Tiền sẽ về tài khoản trong 24h sau khi đơn hoàn tất.</p>
          </li>
          <li className="rounded-2xl border bg-card p-4">
            <p className="font-bold">🚫 Khách không nhận hàng?</p>
            <p className="mt-1 text-sm text-muted-foreground">Hãy báo cho tài xế và gọi hỗ trợ ngay.</p>
          </li>
        </ul>
      </div>
    </MobileShell>
  );
}
