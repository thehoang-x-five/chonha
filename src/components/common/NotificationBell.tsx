import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell({ to }: { to: string }) {
  const { user } = useAuth();
  const { unread } = useNotifications(user?.id);
  return (
    <Link
      to={to as any}
      aria-label="Thông báo"
      className="tap-target relative grid place-items-center rounded-full active:bg-muted"
    >
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
