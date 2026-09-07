import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogoCompact } from "./common/Logo";

export function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-bg dark:bg-dark-bg">
        <LogoCompact size={32} className="animate-pulse-soft" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
