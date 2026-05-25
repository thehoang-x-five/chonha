import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBasket, Store, Bike, ShieldCheck, Phone, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({ meta: [{ title: "Chợ Nhà Mình – Đi chợ tươi mỗi ngày" }] }),
});

const roles = [
  { to: "/customer/home", label: "Vào vai Khách hàng", desc: "Đi chợ, đặt hàng giao tận nhà", icon: ShoppingBasket, color: "from-primary/20 to-primary/5", iconBg: "bg-primary text-primary-foreground" },
  { to: "/vendor/dashboard", label: "Vào vai Chủ gian hàng", desc: "Quản lý sạp & nhận đơn", icon: Store, color: "from-secondary/20 to-secondary/5", iconBg: "bg-secondary text-secondary-foreground" },
  { to: "/driver/home", label: "Vào vai Tài xế", desc: "Nhận cuốc giao hàng", icon: Bike, color: "from-info/20 to-info/5", iconBg: "bg-info text-info-foreground" },
  { to: "/admin/dashboard", label: "Vào vai Admin", desc: "Quản trị nền tảng", icon: ShieldCheck, color: "from-warning/30 to-warning/5", iconBg: "bg-foreground text-background" },
] as const;

function Welcome() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gradient-to-b from-accent/40 via-background to-background safe-top">
      <div className="px-6 pt-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-lg shadow-primary/30">🧺</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">Chợ Nhà Mình</h1>
            <p className="text-xs text-muted-foreground">Đi chợ tươi mỗi ngày – mua đúng sạp quen</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border bg-card p-5 shadow-sm">
          <label className="text-xs font-semibold text-muted-foreground">Số điện thoại</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border bg-background px-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0909 123 456"
              inputMode="tel"
              className="h-12 flex-1 bg-transparent text-base outline-none"
            />
          </div>
          <button
            onClick={() => setOtpSent(true)}
            className="mt-3 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground active:scale-[0.98]"
          >
            {otpSent ? "Đã gửi mã OTP (demo)" : "Gửi mã OTP"}
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Hoặc chọn nhanh vai demo
        </div>

        <div className="mt-3 grid gap-3">
          {roles.map(r => (
            <Link key={r.to} to={r.to} className={`flex items-center gap-3 rounded-2xl border bg-gradient-to-r ${r.color} p-4 transition active:scale-[0.98]`}>
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${r.iconBg}`}>
                <r.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 pb-10 text-center text-xs text-muted-foreground">Bản demo · Chỉ dành cho trải nghiệm</p>
      </div>
    </div>
  );
}
