import { NavLink } from "react-router-dom";
import { Home, Mail, Sparkles, History, Settings } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/inbox", label: "Inbox", icon: Mail },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav({ hidden = false }) {
  if (hidden) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface dark:bg-dark-surface border-t border-surface-border dark:border-dark-border safe-bottom"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 h-16">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                isActive
                  ? "text-brand-blue"
                  : "text-ink-muted dark:text-dark-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[10.5px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
