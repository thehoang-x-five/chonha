import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerBottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/common/PageShell";
import { MobilePageHeader } from "@/components/common/MobilePageHeader";
import { Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/orders/$id/rate")({ component: RatePage });

function Stars({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-3">
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} sao`}
            className="tap-target"
          >
            <Star className={`h-7 w-7 ${n <= value ? "fill-warning text-warning" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function RatePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [market, setMarket] = useState(0);
  const [stall, setStall] = useState(0);
  const [driver, setDriver] = useState(0);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!market || !stall || !driver) {
      toast.error("Vui lòng đánh giá đầy đủ");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    toast.success("Cảm ơn bạn đã đánh giá!");
    navigate({ to: "/customer/orders" });
  };

  return (
    <PageShell area="customer" nav={<CustomerBottomNav />}>
      <MobilePageHeader title="Đánh giá đơn hàng" subtitle={`#${id}`} back={true} />
      <div className="space-y-3 p-4">
        <Stars value={market} onChange={setMarket} label="Trải nghiệm tại chợ" />
        <Stars value={stall} onChange={setStall} label="Chất lượng sản phẩm & gian hàng" />
        <Stars value={driver} onChange={setDriver} label="Thái độ tài xế" />
        <div className="rounded-2xl border bg-card p-3">
          <p className="text-sm font-semibold">Chia sẻ thêm (tuỳ chọn)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm"
            placeholder="Cảm nhận của bạn về đơn này…"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {submitting ? "Đang gửi…" : "Gửi đánh giá"}
        </button>
      </div>
    </PageShell>
  );
}
