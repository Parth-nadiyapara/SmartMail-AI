import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";

const STEPS = [
  "Understanding email content",
  "Detecting priority",
  "Extracting action items",
  "Generating recommendations",
];

export function AnalysisLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} className="text-brand-blue animate-pulse-soft" />
        <h3 className="text-[15px] font-semibold text-ink dark:text-dark-text">
          SmartMail AI
        </h3>
      </div>
      <p className="text-sm text-ink-muted dark:text-dark-muted mb-5">
        Analyzing email...
      </p>
      <ul className="space-y-3">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li key={step} className="flex items-center gap-2.5 text-sm">
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  done
                    ? "bg-brand-green text-white"
                    : active
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "bg-surface-hover dark:bg-dark-surface2 text-ink-muted dark:text-dark-muted"
                }`}
              >
                {done ? (
                  <Check size={12} strokeWidth={3} />
                ) : active ? (
                  <span className="flex gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-brand-blue animate-pulse-soft" />
                    <span className="h-1 w-1 rounded-full bg-brand-blue animate-pulse-soft [animation-delay:0.2s]" />
                    <span className="h-1 w-1 rounded-full bg-brand-blue animate-pulse-soft [animation-delay:0.4s]" />
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={
                  done
                    ? "text-ink dark:text-dark-text"
                    : active
                    ? "text-ink dark:text-dark-text font-medium"
                    : "text-ink-muted dark:text-dark-muted"
                }
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
