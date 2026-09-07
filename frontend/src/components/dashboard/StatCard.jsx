export function StatCard({ label, value, icon: Icon, accent = "text-brand-blue" }) {
  return (
    <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink-muted dark:text-dark-muted">
          {label}
        </span>
        {Icon && <Icon size={16} className={accent} />}
      </div>
      <p className="text-[26px] font-bold text-ink dark:text-dark-text tracking-tight">
        {value}
      </p>
    </div>
  );
}
