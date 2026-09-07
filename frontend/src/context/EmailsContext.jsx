import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { getInboxEmails } from "../services/email.service";
import { ApiError } from "../services/api";

const EmailsContext = createContext(null);

export function EmailsProvider({ children }) {
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);

  const load = useCallback(async (force = false) => {
    if (fetchedOnce.current && !force) return;
    fetchedOnce.current = true;
    setStatus("loading");
    setError(null);
    try {
      const data = await getInboxEmails();
      setEmails(data);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(err.message, 500));
      setStatus("error");
      fetchedOnce.current = false;
    }
  }, []);

  const clear = useCallback(() => {
    setEmails([]);
    setStatus("idle");
    fetchedOnce.current = false;
  }, []);

  return (
    <EmailsContext.Provider value={{ emails, status, error, load, clear }}>
      {children}
    </EmailsContext.Provider>
  );
}

export function useEmails() {
  const ctx = useContext(EmailsContext);
  if (!ctx) throw new Error("useEmails must be used inside EmailsProvider");
  return ctx;
}
