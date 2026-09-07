import { useUsage } from "../../context/UsageContext";
import { Sparkles } from "lucide-react";

export function UsageWidget({ className = "" }) {
  const { usage } = useUsage();

  if (!usage) return null;

  const { analysisCount, dailyAnalysisLimit, remaining } = usage;
  const pct = dailyAnalysisLimit
    ? Math.min(100, (analysisCount / dailyAnalysisLimit) * 100)
    : 0;
  const limitReached = remaining <= 0;

  return (
    <div
      className={`rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface2 p-3.5 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted dark:text-dark-muted mb-2">
        <Sparkles size={13} className="text-brand-blue" />
        Today's AI Usage
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-semibold text-ink dark:text-dark-text">
          {analysisCount} / {dailyAnalysisLimit} analyses
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-hover dark:bg-dark-surface overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            limitReached ? "bg-brand-red" : "bg-brand-blue"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={`text-xs ${
          limitReached
            ? "text-brand-red font-medium"
            : "text-ink-muted dark:text-dark-muted"
        }`}
      >
        {limitReached ? "Daily AI limit reached" : `${remaining} remaining`}
      </p>
    </div>
  );
}
