import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/app-shell";
import { VendorHeader, StepProgress, VENDOR_STEPS, BigActionButton, CallButton } from "@/components/vendor";
import { orders, getProduct, formatVnd } from "@/lib/mock-data";
import { MapPin, MessageSquareWarning } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/vendor/orders/$id")({
  component: Page,
  loader: ({ params }) => {
    const o = orders.find(o => o.id === params.id);
    if (!o) throw notFound();
    return o;
  },
});

function Page() {
  const order = Route.useLoaderData();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [confirmReject, setConfirmReject] = useState(false);

  const myItems = order.items.filter((i: any) => i.stallId === "s1");
  const myTotal = myItems.reduce((s: number, i: any) => s + (getProduct(i.productId)?.price || 0) * i.qty, 0);

  const advance = () => {
    if (step >= VENDOR_STEPS.length - 1) return;
    const next = step + 1;
    setStep(next);
    toast.success(`Đã chuyển sang: ${VENDOR_STEPS[next].label}`);
  };

  const reject = () => {
    setConfirmReject(false);
    toast.error("Đã từ chối đơn");
    nav({ to: "/vendor/orders" });
  };

  const nextLabel = step < VENDOR_STEPS.length - 1 ? VENDOR_STEPS[step + 1].label : "Hoàn tất";

  return (
    <MobileShell>
      <VendorHeader title={`Đơn #${order.code}`} back="/vendor/orders" />
      <div className="space-y-4 px-4 pt-4 pb-28">
        {/* Customer card */}
        <div className="rounded-3xl border-2 bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xl font-extrabold">{order.customer}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{order.address}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Điện thoại: <span className="font-semibold text-foreground">{order.customerPhone}</span></p>
            </div>
            <CallButton phone={order.customerPhone} />
          </div>
        </div>

        {/* Items to prepare */}
        <div className="rounded-3xl border-2 bg-card p-4">
          <p className="text-lg font-extrabold">Hàng cần chuẩn bị</p>
          <ul className="mt-3 space-y-2">
            {myItems.map((i: any) => {
              const p = getProduct(i.productId)!;
              return (
                <li key={i.productId} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                  <span className="text-4xl">{p.image}</span>
                  <div className="flex-1">
                    <p className="text-lg font-bold leading-tight">{p.name}</p>
                    <p className="text-sm text-muted-foreground">Ghi chú: Làm sạch, cắt khúc</p>
                  </div>
                  <span className="rounded-full bg-card px-3 py-1.5 text-base font-extrabold">{i.qty} {p.unit}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t-2 pt-3">
            <span className="text-base font-semibold">Tổng tiền sạp</span>
            <span className="text-xl font-extrabold text-primary">{formatVnd(myTotal)}</span>
          </div>
        </div>

        {/* Replacement note */}
        <div className="flex items-start gap-3 rounded-3xl border-2 border-info/40 bg-info/10 p-4">
          <MessageSquareWarning className="mt-0.5 h-6 w-6 text-info shrink-0" />
          <div>
            <p className="text-base font-extrabold text-info">Khách cho phép thay sản phẩm</p>
            <p className="mt-0.5 text-sm">Nếu hết hàng, cô có thể thay món tương tự giá gần bằng nhau.</p>
          </div>
        </div>

        {/* Step progress */}
        <div className="rounded-3xl border-2 bg-card p-4">
          <p className="mb-3 text-lg font-extrabold">Bước xử lý đơn</p>
          <StepProgress step={step} />
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t-2 bg-card p-3 safe-bottom">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <BigActionButton
            onClick={advance}
            disabled={step >= VENDOR_STEPS.length - 1}
            variant={step >= VENDOR_STEPS.length - 1 ? "success" : "primary"}
          >
            {step >= VENDOR_STEPS.length - 1 ? "Đã giao xong ✓" : `Chuyển: ${nextLabel}`}
          </BigActionButton>
          {step === 0 && (
            <button
              onClick={() => setConfirmReject(true)}
              className="h-16 rounded-2xl border-2 border-destructive/40 bg-destructive/5 px-5 text-base font-extrabold text-destructive"
            >
              Từ chối
            </button>
          )}
        </div>
      </div>

      <AlertDialog open={confirmReject} onOpenChange={setConfirmReject}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Từ chối đơn này?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Khách sẽ nhận thông báo và đơn sẽ được chuyển cho sạp khác. Cô có chắc không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2">
            <AlertDialogCancel className="h-14 rounded-2xl border-2 text-base font-bold">Để xử lý</AlertDialogCancel>
            <AlertDialogAction onClick={reject} className="h-14 rounded-2xl bg-destructive text-base font-extrabold text-destructive-foreground">Từ chối</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}
