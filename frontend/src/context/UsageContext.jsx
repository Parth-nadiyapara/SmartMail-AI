import { createContext, useContext, useState, useCallback } from "react";

const UsageContext = createContext(null);

/**
 * The backend has no standalone "GET current usage" endpoint — usage
 * numbers only come back as part of a POST /analysis/:id response.
 *
 * To avoid showing nothing on the dashboard before the user analyzes
 * anything, `estimateFromHistory` derives a starting point by counting
 * *real* stored history rows created today. This is a read of existing
 * backend data, not a parallel quota system: the instant a real
 * analysis call returns, `setAuthoritative` overwrites this with the
 * backend's own numbers, which always win.
 */
function estimateFromHistory(history, dailyAnalysisLimit) {
  if (!Array.isArray(history)) return null;

  const todayKey = new Date().toDateString();
  const analysisCount = history.filter((row) => {
    const created = row.created_at ? new Date(row.created_at) : null;
    return created && created.toDateString() === todayKey;
  }).length;

  return {
    analysisCount,
    dailyAnalysisLimit,
    remaining: Math.max(dailyAnalysisLimit - analysisCount, 0),
    isEstimate: true,
  };
}

export function UsageProvider({ children }) {
  const [usage, setUsage] = useState(null);

  const setAuthoritative = useCallback((backendUsage) => {
    if (!backendUsage) return;
    setUsage({ ...backendUsage, isEstimate: false });
  }, []);

  const seedFromHistory = useCallback((history, dailyAnalysisLimit) => {
    setUsage((prev) => {
      // Never overwrite an authoritative value with an estimate.
      if (prev && !prev.isEstimate) return prev;
      return estimateFromHistory(history, dailyAnalysisLimit) || prev;
    });
  }, []);

  const reset = useCallback(() => setUsage(null), []);

  return (
    <UsageContext.Provider
      value={{ usage, setAuthoritative, seedFromHistory, reset }}
    >
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used inside UsageProvider");
  return ctx;
}
