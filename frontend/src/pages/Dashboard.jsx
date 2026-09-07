import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Sparkles, AlertTriangle, MessageSquareReply } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEmails } from "../context/EmailsContext";
import { useHistory } from "../context/HistoryContext";
import { useUsage } from "../context/UsageContext";
import { StatCard } from "../components/dashboard/StatCard";
import { EmailRow } from "../components/email/EmailRow";
import { PriorityBadge } from "../components/common/Badge";
import { DashboardStatSkeleton, CardListSkeleton } from "../components/common/Skeleton";
import { EmptyState, ErrorState } from "../components/common/EmptyState";
import { formatRelativeOrDate, greetingForNow } from "../utils/formatDate";

export function Dashboard() {
  const { user } = useAuth();
  const { emails, status: emailStatus, error: emailError, load: loadEmails } = useEmails();
  const { history, status: historyStatus, load: loadHistory } = useHistory();
  const { seedFromHistory } = useUsage();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmails();
    loadHistory();
  }, [loadEmails, loadHistory]);

  useEffect(() => {
    if (historyStatus === "ready" && user?.dailyAnalysisLimit) {
      seedFromHistory(history, user.dailyAnalysisLimit);
    }
  }, [historyStatus, history, user, seedFromHistory]);

  const todayKey = new Date().toDateString();

  const analyzedToday = useMemo(
    () =>
      history.filter(
        (row) => row.created_at && new Date(row.created_at).toDateString() === todayKey
      ).length,
    [history, todayKey]
  );

  const highPriorityCount = useMemo(
    () => history.filter((row) => row.priority === "High").length,
    [history]
  );

  const repliesRequiredCount = useMemo(
    () => history.filter((row) => row.requires_reply).length,
    [history]
  );

  const historyByMessageId = useMemo(() => {
    const map = new Map();
    history.forEach((row) => map.set(row.gmail_message_id, row));
    return map;
  }, [history]);

  const loading = emailStatus === "loading" || emailStatus === "idle";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-8">
      <div>
        <h1 className="text-[26px] md:text-[28px] font-bold text-ink dark:text-dark-text tracking-tight">
          {greetingForNow()}, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-ink-muted dark:text-dark-muted mt-1">
          Here's what's happening in your inbox.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          <>
            <DashboardStatSkeleton />
            <DashboardStatSkeleton />
            <DashboardStatSkeleton />
            <DashboardStatSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Total Emails" value={emails.length} icon={Mail} />
            <StatCard
              label="Analyzed Today"
              value={analyzedToday}
              icon={Sparkles}
            />
            <StatCard
              label="High Priority"
              value={highPriorityCount}
              icon={AlertTriangle}
              accent="text-brand-red"
            />
            <StatCard
              label="Replies Required"
              value={repliesRequiredCount}
              icon={MessageSquareReply}
              accent="text-brand-yellow"
            />
          </>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-ink dark:text-dark-text">
            Recent Emails
          </h2>
          <button
            onClick={() => navigate("/inbox")}
            className="text-sm font-medium text-brand-blue hover:underline"
          >
            View all
          </button>
        </div>

        {emailStatus === "error" ? (
          <ErrorState status={emailError?.status} message={emailError?.message} onRetry={() => loadEmails(true)} />
        ) : loading ? (
          <CardListSkeleton rows={3} />
        ) : emails.length === 0 ? (
          <EmptyState icon={Mail} title="Your inbox is empty." />
        ) : (
          <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface overflow-hidden">
            {emails.slice(0, 5).map((email) => (
              <EmailRow
                key={email.id}
                email={email}
                priority={historyByMessageId.get(email.id)?.priority}
                onClick={() => navigate(`/email/${email.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-ink dark:text-dark-text">
            Recent AI Analyses
          </h2>
          <button
            onClick={() => navigate("/history")}
            className="text-sm font-medium text-brand-blue hover:underline"
          >
            View all
          </button>
        </div>

        {historyStatus === "loading" || historyStatus === "idle" ? (
          <CardListSkeleton rows={3} />
        ) : history.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No analysis history yet."
            description="Analyze an email to see your results here."
          />
        ) : (
          <div className="space-y-2.5">
            {history.slice(0, 5).map((row) => (
              <button
                key={row.id || row.gmail_message_id}
                onClick={() => navigate(`/email/${row.gmail_message_id}`)}
                className="w-full text-left rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4 hover:bg-surface-hover dark:hover:bg-dark-surface2 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
                    {row.subject || "(no subject)"}
                  </p>
                  <PriorityBadge priority={row.priority} />
                </div>
                <p className="text-xs text-ink-muted dark:text-dark-muted truncate">
                  {row.summary}
                </p>
                <p className="text-[11px] text-ink-muted dark:text-dark-muted mt-1.5">
                  {formatRelativeOrDate(row.created_at)}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
