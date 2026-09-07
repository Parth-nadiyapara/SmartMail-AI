import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-blue text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300",
  secondary:
    "bg-transparent border border-surface-border dark:border-dark-border text-ink dark:text-dark-text hover:bg-surface-hover dark:hover:bg-dark-surface2 disabled:opacity-50",
  danger:
    "bg-transparent border border-red-200 dark:border-red-900 text-brand-red hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50",
  ai: "bg-gradient-to-r from-brand-blue via-indigo-500 to-brand-blue text-white hover:opacity-90 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2 disabled:opacity-50",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon: Icon,
    className = "",
    children,
    disabled,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed min-w-[44px] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
});
