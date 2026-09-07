import { useState } from "react";
import { Square, CheckSquare } from "lucide-react";

/**
 * Checked state is local UI-only (not persisted) — the backend has no
 * endpoint to store checklist completion, so we don't pretend it does
 * (spec section 28).
 */
export function ActionItems({ items }) {
  const [checked, setChecked] = useState(() => new Set());

  if (!items || items.length === 0) return null;

  const toggle = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
      <h3 className="text-sm font-semibold text-ink dark:text-dark-text mb-3">
        Action Items
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-2.5 text-left py-1 group"
              >
                {isChecked ? (
                  <CheckSquare size={17} className="text-brand-blue mt-0.5 shrink-0" />
                ) : (
                  <Square
                    size={17}
                    className="text-ink-muted dark:text-dark-muted mt-0.5 shrink-0 group-hover:text-brand-blue"
                  />
                )}
                <span
                  className={`text-sm ${
                    isChecked
                      ? "line-through text-ink-muted dark:text-dark-muted"
                      : "text-ink dark:text-dark-text"
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
