import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon } from "lucide-react";
import { useHistory } from "../context/HistoryContext";
import { PriorityBadge, CategoryBadge } from "../components/common/Badge";
import { CardListSkeleton } from "../components/common/Skeleton";
import { EmptyState, ErrorState } from "../components/common/EmptyState";
import { formatRelativeOrDate } from "../utils/formatDate";

export function History() {
  const { history, status, error, load } = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-[22px] md:text-[26px] font-bold text-ink dark:text-dark-text tracking-tight mb-6">
        Analysis History
      </h1>

      {status === "error" ? (
        <ErrorState status={error?.status} message={error?.message} onRetry={() => load(true)} />
      ) : status === "loading" || status === "idle" ? (
        <CardListSkeleton rows={5} />
      ) : history.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No analysis history yet."
          description="Analyze an email to see your results here."
        />
      ) : (
        <div className="space-y-3">
          {history.map((row) => (
            <button
              key={row.id || row.gmail_message_id}
              onClick={() => navigate(`/email/${row.gmail_message_id}`)}
              className="w-full text-left rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4 hover:bg-surface-hover dark:hover:bg-dark-surface2 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink dark:text-dark-text truncate">
                    {row.subject || "(no subject)"}
                  </p>
                  <p className="text-xs text-ink-muted dark:text-dark-muted truncate">
                    {row.sender}
                  </p>
                </div>
                <span className="text-xs text-ink-muted dark:text-dark-muted shrink-0">
                  {formatRelativeOrDate(row.created_at)}
                </span>
              </div>
              <p className="text-sm text-ink-muted dark:text-dark-muted mb-3 line-clamp-2">
                {row.summary}
              </p>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={row.priority} />
                <CategoryBadge category={row.category} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
