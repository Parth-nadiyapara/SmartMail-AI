import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, SlidersHorizontal, Mail, X } from "lucide-react";
import { useEmails } from "../context/EmailsContext";
import { useHistory } from "../context/HistoryContext";
import { EmailRow } from "../components/email/EmailRow";
import { EmailRowSkeleton } from "../components/common/Skeleton";
import { EmptyState, ErrorState } from "../components/common/EmptyState";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "high", label: "High priority" },
];

export function Inbox() {
  const { emails, status, error, load } = useEmails();
  const { history, load: loadHistory } = useHistory();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const query = params.get("q") || "";

  useEffect(() => {
    load();
    loadHistory();
  }, [load, loadHistory]);

  const historyByMessageId = useMemo(() => {
    const map = new Map();
    history.forEach((row) => map.set(row.gmail_message_id, row));
    return map;
  }, [history]);

  const filtered = useMemo(() => {
    let list = emails;

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.subject?.toLowerCase().includes(q) ||
          e.from?.toLowerCase().includes(q) ||
          e.snippet?.toLowerCase().includes(q)
      );
    }

    if (filter === "unread") {
      list = list.filter((e) => !e.isRead);
    } else if (filter === "high") {
      list = list.filter((e) => historyByMessageId.get(e.id)?.priority === "High");
    }

    return list;
  }, [emails, query, filter, historyByMessageId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load(true);
    await loadHistory(true);
    setRefreshing(false);
  };

  const clearSearch = () => {
    params.delete("q");
    setParams(params, { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-surface-border dark:border-dark-border">
        <div>
          <h1 className="hidden md:block text-[22px] font-bold text-ink dark:text-dark-text tracking-tight">
            Inbox
          </h1>
          {query && (
            <div className="flex items-center gap-2 text-sm text-ink-muted dark:text-dark-muted mt-0.5 md:mt-1">
              Searching “{query}”
              <button onClick={clearSearch} className="text-brand-blue hover:underline">
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            aria-label="Refresh inbox"
            className="h-10 w-10 flex items-center justify-center rounded-lg text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setFilterSheetOpen(true)}
            aria-label="Filter emails"
            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-colors ${
              filter !== "all"
                ? "text-brand-blue bg-surface-selected dark:bg-dark-surface2"
                : "text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2"
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Filter pills - desktop inline */}
      <div className="hidden md:flex items-center gap-2 px-6 py-3 border-b border-surface-border dark:border-dark-border">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-brand-blue text-white"
                : "bg-surface-hover dark:bg-dark-surface2 text-ink-muted dark:text-dark-muted hover:text-ink dark:hover:text-dark-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div>
        {status === "error" ? (
          <ErrorState status={error?.status} message={error?.message} onRetry={() => load(true)} />
        ) : status === "loading" || status === "idle" ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <EmailRowSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Mail}
            title={query || filter !== "all" ? "No matching emails" : "Your inbox is empty."}
            description={
              query || filter !== "all"
                ? "Try a different search or filter."
                : undefined
            }
          />
        ) : (
          <div>
            {filtered.map((email) => (
              <EmailRow
                key={email.id}
                email={email}
                priority={historyByMessageId.get(email.id)?.priority}
                onClick={() => navigate(`/email/${email.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter bottom sheet */}
      {filterSheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-[80] bg-black/40 flex items-end animate-fade-in"
          onClick={() => setFilterSheetOpen(false)}
        >
          <div
            className="w-full bg-surface dark:bg-dark-surface rounded-t-2xl p-5 safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink dark:text-dark-text">
                Filter emails
              </h3>
              <button onClick={() => setFilterSheetOpen(false)} aria-label="Close">
                <X size={20} className="text-ink-muted dark:text-dark-muted" />
              </button>
            </div>
            <div className="space-y-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFilter(f.value);
                    setFilterSheetOpen(false);
                  }}
                  className={`w-full text-left rounded-lg px-4 py-3.5 text-sm font-medium min-h-[44px] ${
                    filter === f.value
                      ? "bg-surface-selected dark:bg-dark-surface2 text-brand-blue"
                      : "text-ink dark:text-dark-text"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
