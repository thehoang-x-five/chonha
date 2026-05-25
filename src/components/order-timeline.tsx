import { Check, Loader2 } from "lucide-react";
import type { Order } from "@/lib/mock-data";

const steps: { key: Order["status"]; label: string }[] = [
  { key: "confirmed", label: "Đã xác nhận đơn" },
  { key: "preparing", label: "Các sạp đang chuẩn bị hàng" },
  { key: "finding_driver", label: "Đang tìm tài xế gần chợ" },
  { key: "picking", label: "Tài xế đang lấy hàng tại chợ" },
  { key: "delivering", label: "Đang giao đến bạn" },
  { key: "completed", label: "Đã giao thành công" },
];

const order: Order["status"][] = ["confirmed","preparing","finding_driver","picking","delivering","completed"];

export function OrderTimeline({ current }: { current: Order["status"] }) {
  const idx = order.indexOf(current);
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.key} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <div className={`grid h-8 w-8 place-items-center rounded-full border-2 ${done ? "border-success bg-success text-success-foreground" : active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                {done ? <Check className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">{i+1}</span>}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 flex-1 ${done ? "bg-success" : "bg-border"}`} style={{ minHeight: 24 }} />}
            </div>
            <div className={`flex-1 pb-3 pt-1 text-sm ${active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
