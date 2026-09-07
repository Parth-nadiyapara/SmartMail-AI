import { useEffect, useState } from "react";
import { urgencyBarColor } from "../../utils/priority";

export function ProgressBar({ value, max = 100, className = "" }) {
  const [width, setWidth] = useState(0);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  return (
    <div
      className={`h-2 w-full rounded-full bg-surface-hover dark:bg-dark-surface2 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${urgencyBarColor(value)}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
