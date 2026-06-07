import { createFileRoute } from "@tanstack/react-router";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { Phone, MessageCircle, ChevronDown, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { notifyTodo } from "@/lib/notify";

export const Route = createFileRoute("/customer/support")({ component: SupportPage });

const FAQS = [
  { q: "Làm sao đặt hàng?", a: "Chọn chợ → vào gian hàng → thêm sản phẩm vào giỏ → đặt hàng và thanh toán khi nhận hàng hoặc qua ví." },
  { q: "Tôi có thể huỷ đơn không?", a: "Bạn có thể huỷ đơn khi gian hàng chưa xác nhận. Sau khi tài xế nhận, cần liên hệ hỗ trợ." },
  { q: "Phí giao hàng tính ra sao?", a: "Phí cơ bản 18.000đ trong nội thành, có thể được miễn nếu áp dụng mã FREESHIP." },
  { q: "Tôi không nhận được hàng tươi như mong đợi?", a: "Vui lòng chụp hình và liên hệ hỗ trợ trong 24h, chúng tôi sẽ hoàn tiền hoặc đổi sản phẩm." },
  { q: "Làm sao trở thành chủ gian hàng?", a: "Vào mục Hồ sơ → Đăng ký bán hàng, đội vận hành sẽ liên hệ trong 1-2 ngày." },
];

function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title="Trợ giúp" back="/customer/profile" />
      <section className="px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5" />
            <p className="text-sm font-semibold">Đội hỗ trợ 24/7</p>
          </div>
          <p className="mt-1 text-xs opacity-90">Sẵn sàng giải đáp về đơn hàng, thanh toán và hoàn tiền.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href="tel:19001234"
              className="flex items-center justify-center gap-1.5 rounded-full bg-card py-2.5 text-sm font-semibold text-foreground"
            >
              <Phone className="h-4 w-4" /> Gọi 1900 1234
            </a>
            <button
              type="button"
              onClick={() => notifyTodo("Trò chuyện")}
              className="flex items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Chat ngay
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-sm font-bold">Câu hỏi thường gặp</h2>
        <ul className="mt-2 space-y-2">
          {FAQS.map((f, i) => (
            <li key={f.q} className="overflow-hidden rounded-2xl border bg-card">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="border-t bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{f.a}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pb-6 pt-6">
        <h2 className="text-sm font-bold">Liên hệ khác</h2>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="rounded-2xl border bg-card p-3">
            <p className="font-semibold">Email</p>
            <a href="mailto:hotro@chonha.vn" className="text-primary">hotro@chonha.vn</a>
          </li>
          <li className="rounded-2xl border bg-card p-3">
            <p className="font-semibold">Văn phòng</p>
            <p className="text-xs text-muted-foreground">123 Nguyễn Huệ, Q.1, TP.HCM</p>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
