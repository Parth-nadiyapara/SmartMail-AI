import { Sparkles, Calendar, MessageSquareReply, Lightbulb } from "lucide-react";
import { PriorityBadge, CategoryBadge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";
import { ActionItems } from "./ActionItems";
import { ReplySuggestion } from "./ReplySuggestion";

export function AnalysisPanel({ analysis }) {
  if (!analysis) return null;

  const {
    summary,
    priority,
    category,
    urgencyScore,
    deadline,
    requiresReply,
    actionItems,
    recommendations,
    replySuggestion,
  } = analysis;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-card border border-surface-border dark:border-dark-border bg-gradient-to-br from-blue-50/60 via-surface to-surface dark:from-blue-950/20 dark:via-dark-surface dark:to-dark-surface p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-brand-blue" />
          <h2 className="text-[15px] font-semibold text-ink dark:text-dark-text">
            SmartMail AI Analysis
          </h2>
        </div>

        <p className="text-sm text-ink dark:text-dark-text leading-relaxed mb-4">
          {summary}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <PriorityBadge priority={priority} size="md" />
          <CategoryBadge category={category} size="md" />
          {requiresReply && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border dark:border-dark-border bg-surface-hover dark:bg-dark-surface2 px-2.5 py-1 text-xs font-medium text-ink-muted dark:text-dark-muted">
              <MessageSquareReply size={12} />
              Reply required
            </span>
          )}
          {deadline && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border dark:border-dark-border bg-surface-hover dark:bg-dark-surface2 px-2.5 py-1 text-xs font-medium text-ink-muted dark:text-dark-muted">
              <Calendar size={12} />
              {deadline}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-medium text-ink-muted dark:text-dark-muted">
              Urgency Score
            </span>
            <span className="text-sm font-semibold text-ink dark:text-dark-text">
              {urgencyScore} / 100
            </span>
          </div>
          <ProgressBar value={urgencyScore} />
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb size={15} className="text-brand-yellow" />
            <h3 className="text-sm font-semibold text-ink dark:text-dark-text">
              Recommendations
            </h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="text-sm text-ink dark:text-dark-text flex gap-2.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink-muted dark:bg-dark-muted mt-2 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ActionItems items={actionItems} />

      <ReplySuggestion text={replySuggestion} />
    </div>
  );
}
