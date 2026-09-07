import { Inbox, AlertTriangle, WifiOff, ShieldAlert, SearchX } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-14 w-14 rounded-full bg-surface-hover dark:bg-dark-surface2 flex items-center justify-center mb-4">
        <Icon size={24} className="text-ink-muted dark:text-dark-muted" />
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-dark-text mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-ink-muted dark:text-dark-muted max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const ERROR_PRESETS = {
  401: {
    icon: ShieldAlert,
    title: "Your Google session has expired",
    description: "Sign in again to keep using SmartMail AI.",
  },
  403: {
    icon: ShieldAlert,
    title: "Access denied",
    description: "You don't have permission to view this.",
  },
  404: {
    icon: SearchX,
    title: "Not found",
    description: "We couldn't find what you were looking for.",
  },
  429: {
    icon: AlertTriangle,
    title: "Daily AI limit reached",
    description: "You've used all your AI analyses for today. Your limit resets tomorrow.",
  },
  0: {
    icon: WifiOff,
    title: "Can't reach the server",
    description: "Check your connection and try again.",
  },
  500: {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "Our server hit a snag. Please try again.",
  },
};

export function ErrorState({ status, message, onRetry }) {
  const preset = ERROR_PRESETS[status] || ERROR_PRESETS[500];
  const Icon = preset.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4">
        <Icon size={24} className="text-brand-red" />
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-dark-text mb-1">
        {preset.title}
      </h3>
      <p className="text-sm text-ink-muted dark:text-dark-muted max-w-xs">
        {message || preset.description}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
