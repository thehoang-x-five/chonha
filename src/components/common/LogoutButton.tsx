import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  className?: string;
  label?: string;
}

/** Calls authService.logout() then navigates to "/". Use everywhere a user
 *  needs to sign out so we never leave a stale session in localStorage. */
export function LogoutButton({ className, label = "Đăng xuất" }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handle = async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
    await logout();
    toast.success("Đã đăng xuất");
    navigate({ to: "/" });
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={
        className ??
        "flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive active:scale-[0.99]"
      }
    >
      <LogOut className="h-4 w-4" /> {label}
    </button>
  );
}
