import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogoCompact } from "../components/common/Logo";

/**
 * The backend's Google OAuth callback (after Patch 2) redirects the
 * browser here once the session cookie is set. We just need to confirm
 * the session by calling /auth/me and then move into the app.
 */
export function AuthCallback() {
  const { refreshUser, isAuthenticated, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/dashboard", { replace: true });
    } else if (status === "unauthenticated") {
      navigate("/login", { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-bg dark:bg-dark-bg">
      <LogoCompact size={32} className="animate-pulse-soft" />
      <p className="text-sm text-ink-muted dark:text-dark-muted">
        Signing you in...
      </p>
    </div>
  );
}
