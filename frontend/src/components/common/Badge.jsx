import { getPriorityStyle, getCategoryIcon } from "../../utils/priority";

export function PriorityBadge({ priority, size = "sm" }) {
  const style = getPriorityStyle(priority);
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${style.bg} ${style.border} ${style.text} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}

export function CategoryBadge({ category, size = "sm" }) {
  const Icon = getCategoryIcon(category);
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-surface-border dark:border-dark-border bg-surface-hover dark:bg-dark-surface2 text-ink-muted dark:text-dark-muted font-medium ${padding}`}
    >
      <Icon size={12} />
      {category}
    </span>
  );
}
