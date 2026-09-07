import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUser, logout as logoutRequest } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated
  const [loadError, setLoadError] = useState(null);

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
      setStatus(current ? "authenticated" : "unauthenticated");
      setLoadError(null);
    } catch (error) {
      setLoadError(error);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      // Clear everything regardless of whether the request round-tripped
      // cleanly, so a flaky network call never traps the user mid-logout.
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const updateDailyLimit = useCallback((dailyAnalysisLimit) => {
    setUser((prev) => (prev ? { ...prev, dailyAnalysisLimit } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        loadError,
        isAuthenticated: status === "authenticated",
        refreshUser,
        logout,
        updateDailyLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
