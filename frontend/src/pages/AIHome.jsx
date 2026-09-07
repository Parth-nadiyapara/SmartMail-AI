import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useHistory } from "../context/HistoryContext";
import { useUsage } from "../context/UsageContext";
import { UsageWidget } from "../components/common/UsageWidget";
import { PriorityBadge } from "../components/common/Badge";
import { CardListSkeleton } from "../components/common/Skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { formatRelativeOrDate } from "../utils/formatDate";
import { Button } from "../components/common/Button";

/**
 * Mobile-only bottom-nav destination (spec section 34/37). Desktop
 * doesn't have an equivalent tab — AI analysis lives inline on the
 * email detail page there.
 */
export function AIHome() {
  const { history, status, load } = useHistory();
  const { usage } = useUsage();
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-4 py-5 pb-10 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-brand-blue" />
        <h1 className="text-xl font-bold text-ink dark:text-dark-text tracking-tight">
          SmartMail AI
        </h1>
      </div>

      {usage && <UsageWidget />}

      <Button
        variant="ai"
        size="lg"
        icon={Sparkles}
        className="w-full"
        onClick={() => navigate("/inbox")}
      >
        Analyze an email
      </Button>

      <div>
        <h2 className="text-sm font-semibold text-ink-muted dark:text-dark-muted mb-3">
          Recent analyses
        </h2>
        {status === "loading" || status === "idle" ? (
          <CardListSkeleton rows={3} />
        ) : history.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No analysis history yet."
            description="Analyze an email to see your results here."
          />
        ) : (
          <div className="space-y-2.5">
            {history.slice(0, 8).map((row) => (
              <button
                key={row.id || row.gmail_message_id}
                onClick={() => navigate(`/email/${row.gmail_message_id}`)}
                className="w-full text-left rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-3.5 active:bg-surface-hover dark:active:bg-dark-surface2"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
                    {row.subject || "(no subject)"}
                  </p>
                  <PriorityBadge priority={row.priority} />
                </div>
                <p className="text-xs text-ink-muted dark:text-dark-muted">
                  {formatRelativeOrDate(row.created_at)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
