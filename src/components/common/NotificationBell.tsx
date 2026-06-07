import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell({ to }: { to: string }) {
  const { unreadCount } = useNotifications();
  return (
    <Link
      to={to as any}
      aria-label="Thông báo"
      className="tap-target relative grid place-items-center rounded-full active:bg-muted"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
