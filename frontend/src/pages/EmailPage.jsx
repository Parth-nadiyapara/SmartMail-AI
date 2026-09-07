import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, Paperclip } from "lucide-react";
import { useEmails } from "../context/EmailsContext";
import { useHistory } from "../context/HistoryContext";
import { useUsage } from "../context/UsageContext";
import { useAuth } from "../context/AuthContext";
import { analyzeEmail } from "../services/analysis.service";
import { Button } from "../components/common/Button";
import { AnalysisPanel } from "../components/analysis/AnalysisPanel";
import { AnalysisLoading } from "../components/analysis/AnalysisLoading";
import { EmptyState, ErrorState } from "../components/common/EmptyState";
import { Skeleton } from "../components/common/Skeleton";
import { formatFullDateTime } from "../utils/formatDate";
import { historyRowToAnalysis } from "../utils/historyMapper";
import { useToast } from "../context/ToastContext";
import { parseSender } from "../components/email/EmailRow";
import { ApiError } from "../services/api";

export function EmailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { emails, status: emailsStatus, load: loadEmails } = useEmails();
  const { history, status: historyStatus, load: loadHistory, upsert } = useHistory();
  const { setAuthoritative } = useUsage();
  const { updateDailyLimit } = useAuth();
  const { showToast } = useToast();

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [freshAnalysis, setFreshAnalysis] = useState(null); // result of a POST call this session

  useEffect(() => {
    loadEmails();
    loadHistory();
  }, [loadEmails, loadHistory]);

  const email = useMemo(() => emails.find((e) => e.id === id), [emails, id]);

  const existingHistoryRow = useMemo(
    () => history.find((row) => row.gmail_message_id === id),
    [history, id]
  );

  const analysisToShow = freshAnalysis || historyRowToAnalysis(existingHistoryRow);
  const alreadyAnalyzed = Boolean(existingHistoryRow) && !freshAnalysis;

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const result = await analyzeEmail(id);
      setFreshAnalysis(result.analysis);
      setAuthoritative(result.usage);
      if (result.usage?.dailyAnalysisLimit) {
        updateDailyLimit(result.usage.dailyAnalysisLimit);
      }
      if (result.history) upsert(result.history);

      // The upsert above is an optimistic client-side merge so the UI
      // updates instantly. Reconcile it against the backend's own
      // /analysis-history the moment a *new* analysis is created, so
      // Dashboard/History are guaranteed correct rather than just
      // "probably correct". Skipped when the result was cached, since
      // nothing changed server-side and the existing entry already
      // matches — this avoids an unnecessary duplicate request.
      if (!result.cached) {
        loadHistory(true);
      }

      showToast(
        result.cached ? "Showing your existing analysis." : "Email analyzed successfully.",
        { type: "success" }
      );
    } catch (error) {
      setAnalyzeError(
        error instanceof ApiError ? error : new ApiError(error.message, 500)
      );
    } finally {
      setAnalyzing(false);
    }
  }, [id, setAuthoritative, updateDailyLimit, upsert, showToast, loadHistory]);

  const loading =
    (emailsStatus === "loading" || emailsStatus === "idle") &&
    (historyStatus === "loading" || historyStatus === "idle");

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!email) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Email not found"
        description="This email may no longer be in your inbox."
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate("/inbox")}>
            Back to inbox
          </Button>
        }
      />
    );
  }

  const { name, email: senderEmail } = parseSender(email.from);
  const limitReached = analyzeError?.code === "DAILY_ANALYSIS_LIMIT_REACHED";

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-ink dark:text-dark-text tracking-tight break-words mb-3">
          {email.subject || "(no subject)"}
        </h1>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-surface-border dark:border-dark-border">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
              {name}
            </p>
            <p className="text-xs text-ink-muted dark:text-dark-muted truncate break-all">
              {senderEmail}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {email.hasAttachments && (
              <Paperclip size={14} className="text-ink-muted dark:text-dark-muted" />
            )}
            <span className="text-xs text-ink-muted dark:text-dark-muted whitespace-nowrap">
              {formatFullDateTime(email.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="prose-sm text-sm text-ink dark:text-dark-text leading-relaxed break-words whitespace-pre-wrap mb-8">
        {email.body || email.snippet}
      </div>

      <div className="mb-5">
        {alreadyAnalyzed ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-brand-green text-sm font-medium px-3 py-1.5">
            <CheckCircle2 size={15} />
            Already Analyzed
          </div>
        ) : (
          <Button variant="ai" size="lg" icon={Sparkles} loading={analyzing} onClick={handleAnalyze}>
            {analyzing ? "Analyzing..." : "Analyze Email"}
          </Button>
        )}
      </div>

      {analyzing && <AnalysisLoading />}

      {!analyzing && analyzeError && (
        <div className="rounded-card border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4 mb-4">
          <p className="text-sm font-medium text-brand-red mb-1">
            {limitReached
              ? "Daily AI limit reached."
              : "AI analysis couldn't be completed."}
          </p>
          <p className="text-sm text-ink-muted dark:text-dark-muted mb-3">
            {limitReached
              ? "You've used all your AI analyses for today. Your limit will reset tomorrow."
              : "Your analysis quota was not used. Try again."}
          </p>
          {!limitReached && (
            <Button variant="secondary" size="sm" onClick={handleAnalyze}>
              Try again
            </Button>
          )}
        </div>
      )}

      {!analyzing && analysisToShow && <AnalysisPanel analysis={analysisToShow} />}
    </div>
  );
}