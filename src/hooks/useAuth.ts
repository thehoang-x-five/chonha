import { useEffect, useState, useCallback } from "react";
import { authService, type Session } from "@/services/authService";
import type { UserRole } from "@/types/user.types";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authService.getCurrentSession().then((s) => {
      if (!mounted) return;
      setSession(s);
      setLoading(false);
    });
    const h = () => { authService.getCurrentSession().then((s) => mounted && setSession(s)); };
    window.addEventListener("cnm-auth", h);
    window.addEventListener("storage", h);
    return () => {
      mounted = false;
      window.removeEventListener("cnm-auth", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const loginAsRole = useCallback(async (role: UserRole) => {
    const s = await authService.loginAsRole(role);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  return {
    user: session?.user ?? null,
    role: session?.role ?? null,
    isAuthenticated: !!session,
    loading,
    loginAsRole,
    logout,
  };
}
