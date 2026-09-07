import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { mode, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const CurrentIcon =
    OPTIONS.find((o) => o.value === mode)?.icon ||
    (resolvedTheme === "dark" ? Moon : Sun);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-9 w-9 flex items-center justify-center rounded-lg text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2 transition-colors"
      >
        <CurrentIcon size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 mt-2 w-40 rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface shadow-lg py-1.5 z-40"
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              role="menuitemradio"
              aria-checked={mode === value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors ${
                mode === value
                  ? "text-brand-blue font-medium"
                  : "text-ink dark:text-dark-text hover:bg-surface-hover dark:hover:bg-dark-surface2"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
