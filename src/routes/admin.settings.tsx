import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  return (
    <AdminShell title="Cấu hình">
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Phí giao hàng">
          <Row label="Phí cơ bản" value="18.000 đ" />
          <Row label="Phí thêm mỗi km" value="3.500 đ" />
          <Row label="Phụ thu giờ cao điểm" value="+5.000 đ" />
        </Section>
        <Section title="Hoa hồng nền tảng">
          <Row label="Gian hàng" value="8%" />
          <Row label="Tài xế" value="12%" />
        </Section>
        <Section title="Voucher đang hoạt động">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between rounded-xl bg-muted/50 p-3"><span><b>CHOSANG30</b> · giảm 30k đơn ≥ 200k</span><span className="text-xs text-muted-foreground">HSD 30/10</span></li>
            <li className="flex justify-between rounded-xl bg-muted/50 p-3"><span><b>FREESHIP</b> · miễn phí giao đơn đầu</span><span className="text-xs text-muted-foreground">HSD 15/11</span></li>
          </ul>
        </Section>
        <Section title="Liên hệ & hỗ trợ">
          <Row label="Hotline" value="1900 1234" />
          <Row label="Email hỗ trợ" value="hotro@chonhaminh.vn" />
          <Row label="Giờ làm việc" value="6:00 – 22:00 hằng ngày" />
        </Section>
        <Section title="Giờ mở cửa chợ">
          <Row label="Chợ Tân Mỹ" value="5:00 – 19:00" />
          <Row label="Chợ Phước Long" value="5:30 – 18:30" />
          <Row label="Chợ Tân Quy" value="5:00 – 17:00" />
        </Section>
      </div>
    </AdminShell>
  );
}
function Section({ title, children }: any) { return <div className="rounded-2xl border bg-card p-5"><h3 className="mb-3 font-bold">{title}</h3><div className="space-y-2">{children}</div></div>; }
function Row({ label, value }: any) {
  return <div className="flex items-center justify-between rounded-xl border p-3"><span className="text-sm">{label}</span><span className="font-bold">{value}</span></div>;
}
