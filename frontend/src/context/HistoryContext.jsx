import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { getAnalysisHistory } from "../services/history.service";
import { ApiError } from "../services/api";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);

  const load = useCallback(async (force = false) => {
    if (fetchedOnce.current && !force) return;
    fetchedOnce.current = true;
    setStatus("loading");
    setError(null);
    try {
      const data = await getAnalysisHistory();
      setHistory(data);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(err.message, 500));
      setStatus("error");
      fetchedOnce.current = false;
    }
  }, []);

  // Optimistically merge a freshly-created/updated analysis so History
  // and Dashboard reflect it immediately without a full refetch.
  const upsert = useCallback((record) => {
    setHistory((prev) => {
      const idx = prev.findIndex(
        (row) => row.gmail_message_id === record.gmail_message_id
      );
      if (idx === -1) return [record, ...prev];
      const next = [...prev];
      next[idx] = record;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    setStatus("idle");
    fetchedOnce.current = false;
  }, []);

  return (
    <HistoryContext.Provider
      value={{ history, status, error, load, upsert, clear }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used inside HistoryProvider");
  return ctx;
}
