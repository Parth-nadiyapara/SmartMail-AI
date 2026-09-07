import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox as InboxIcon,
  History,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { LogoFull } from "../common/Logo";
import { Avatar } from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/history", label: "Analysis History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileNavDrawer({ open, onClose, onLogoutClick }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-[95]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 w-[78%] max-w-[300px] bg-surface dark:bg-dark-surface shadow-xl flex flex-col animate-fade-in safe-top safe-bottom">
        <div className="h-14 flex items-center justify-between pl-4 pr-2 border-b border-surface-border dark:border-dark-border">
          <LogoFull size={24} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            title="Close sidebar"
            className="h-11 w-11 flex items-center justify-center rounded-lg active:bg-surface-hover dark:active:bg-dark-surface2"
          >
            <X size={20} className="text-ink-muted dark:text-dark-muted" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-surface-selected dark:bg-dark-surface2 text-brand-blue"
                    : "text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2 hover:text-ink dark:hover:text-dark-text"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-border dark:border-dark-border p-3">
          <div className="flex items-center gap-2.5 px-1 mb-2">
            <Avatar name={user?.name} email={user?.email} photo={user?.photo} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
                {user?.name}
              </p>
              <p className="text-xs text-ink-muted dark:text-dark-muted truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-3 min-h-[44px] text-sm font-medium text-ink-muted dark:text-dark-muted hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-brand-red transition-colors"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}