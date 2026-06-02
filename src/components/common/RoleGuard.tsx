import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { canAccessArea, type AppArea } from "@/lib/permissions";
import { ROLE_FORBIDDEN_TOAST } from "@/lib/constants";

interface Props {
  area: AppArea;
  children: React.ReactNode;
}

/**
 * Lightweight frontend-only role guard. Auto-logs the user in as the area's
 * role if there's no session yet (demo behavior), redirects to "/" if the
 * current role doesn't match and isn't admin.
 */
export function RoleGuard({ area, children }: Props) {
  const { role, loading, loginAsRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!role) {
      // Demo mode: auto-issue a session for the area entered.
      loginAsRole(area);
      return;
    }
    if (!canAccessArea(role, area)) {
      toast.error(ROLE_FORBIDDEN_TOAST);
      navigate({ to: "/" });
    }
  }, [role, loading, area, loginAsRole, navigate]);

  return <>{children}</>;
}
