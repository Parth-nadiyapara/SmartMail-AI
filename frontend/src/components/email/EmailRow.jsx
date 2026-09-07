import { PriorityBadge } from "../common/Badge";
import { formatRelativeOrDate } from "../../utils/formatDate";
import { Paperclip } from "lucide-react";

function parseSender(fromHeader) {
  if (!fromHeader) return { name: "Unknown sender", email: "" };
  const match = fromHeader.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    const name = match[1].replace(/"/g, "").trim();
    return { name: name || match[2], email: match[2] };
  }
  return { name: fromHeader, email: fromHeader };
}

export function EmailRow({ email, selected, onClick, priority }) {
  const { name } = parseSender(email.from);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-surface-border dark:border-dark-border transition-colors ${
        selected
          ? "bg-surface-selected dark:bg-dark-surface2"
          : "hover:bg-surface-hover dark:hover:bg-dark-surface2"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${
          email.isRead ? "bg-transparent" : "bg-brand-blue"
        }`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm truncate ${
              email.isRead
                ? "text-ink-muted dark:text-dark-muted"
                : "font-semibold text-ink dark:text-dark-text"
            }`}
          >
            {name}
          </span>
          <span className="text-xs text-ink-muted dark:text-dark-muted shrink-0">
            {formatRelativeOrDate(email.date)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <p
            className={`text-sm truncate ${
              email.isRead
                ? "text-ink-muted dark:text-dark-muted"
                : "text-ink dark:text-dark-text"
            }`}
          >
            <span className={email.isRead ? "" : "font-medium"}>
              {email.subject || "(no subject)"}
            </span>
            <span className="text-ink-muted dark:text-dark-muted">
              {" "}
              — {email.snippet}
            </span>
          </p>
          {email.hasAttachments && (
            <Paperclip size={12} className="text-ink-muted dark:text-dark-muted shrink-0" />
          )}
        </div>
      </div>

      {priority && (
        <div className="hidden sm:block shrink-0">
          <PriorityBadge priority={priority} />
        </div>
      )}
    </button>
  );
}

export { parseSender };
