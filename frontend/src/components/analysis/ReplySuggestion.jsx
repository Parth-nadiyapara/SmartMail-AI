import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

export function ReplySuggestion({ text }) {
  const [copied, setCopied] = useState(false);

  if (!text) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable — fail silently,
      // the text is still selectable/readable in the card.
    }
  };

  return (
    <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink dark:text-dark-text">
          <Sparkles size={15} className="text-brand-blue" />
          Suggested Reply
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            copied
              ? "text-brand-green"
              : "text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2"
          }`}
        >
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy Reply
            </>
          )}
        </button>
      </div>
      <div className="rounded-lg bg-surface-bg dark:bg-dark-surface2 p-3.5 text-sm text-ink dark:text-dark-text leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  );
}
