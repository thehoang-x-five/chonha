import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, MobileShell } from "@/components/app-shell";
import { orders, getProduct, formatVnd } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Check } from "lucide-react";

export const Route = createFileRoute("/vendor/orders/$id")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

const steps = ["Nhận đơn", "Đang chuẩn bị", "Đã chuẩn bị xong", "Đã giao cho tài xế"];

function Page() {
  const order = Route.useLoaderData();
  const [step, setStep] = useState(0);
  return (
    <MobileShell>
      <AppHeader title={`Đơn #${order.code}`} back="/vendor/orders" />
      <div className="space-y-3 px-4 pt-3 pb-8">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-base font-bold">{order.customer}</p>
          <p className="text-xs text-muted-foreground">{order.address}</p>
          <p className="mt-1 text-xs text-muted-foreground">SĐT: {order.customerPhone}</p>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-base font-bold">Sản phẩm cần chuẩn bị</p>
          <ul className="mt-2 space-y-2">
            {order.items.filter((i: any) => i.stallId === "s1").map((i: any) => {
              const p = getProduct(i.productId)!;
              return (
                <li key={i.productId} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <span className="text-3xl">{p.image}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Số lượng: {i.qty} {p.unit}</p>
                    <p className="text-xs text-muted-foreground">Ghi chú: Làm sạch, cắt khúc</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border bg-info/10 p-4">
          <p className="text-sm font-bold text-info">Yêu cầu thay thế</p>
          <p className="mt-1 text-sm">Khách cho phép thay sản phẩm tương tự nếu hết hàng.</p>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <p className="mb-3 text-base font-bold">Tiến trình</p>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <div className={`grid h-7 w-7 place-items-center rounded-full ${i <= step ? "bg-success text-success-foreground" : "border bg-muted"}`}>{i <= step ? <Check className="h-4 w-4" /> : <span className="text-xs">{i+1}</span>}</div>
                <span className={`flex-1 text-base ${i === step ? "font-bold" : ""}`}>{s}</span>
              </li>
            ))}
          </ol>
          <button onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))} disabled={step === steps.length - 1} className="mt-4 h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground disabled:opacity-50">
            {step < steps.length - 1 ? `Chuyển: ${steps[step + 1]}` : "Hoàn tất"}
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
