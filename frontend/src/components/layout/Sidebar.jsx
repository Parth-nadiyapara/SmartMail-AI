import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox as InboxIcon,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoFull, LogoCompact } from "../common/Logo";
import { Avatar } from "../common/Avatar";
import { UsageWidget } from "../common/UsageWidget";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/history", label: "Analysis History", icon: History },
];

export function Sidebar({ collapsed = false, onToggleCollapse, onLogoutClick }) {
  const { user } = useAuth();

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div
        className={`h-16 flex items-center border-b border-surface-border dark:border-dark-border ${
          collapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
          className={`flex items-center h-11 rounded-lg transition-colors hover:bg-surface-hover dark:hover:bg-dark-surface2 focus-visible:ring-2 focus-visible:ring-brand-blue ${
            collapsed ? "w-11 justify-center" : "px-1.5 -ml-1.5"
          }`}
        >
          {collapsed ? <LogoCompact size={26} /> : <LogoFull size={26} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-surface-selected dark:bg-dark-surface2 text-brand-blue"
                  : "text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2 hover:text-ink dark:hover:text-dark-text"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon size={19} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        <div className="pt-3 mt-3 border-t border-surface-border dark:border-dark-border">
          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-surface-selected dark:bg-dark-surface2 text-brand-blue"
                  : "text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2 hover:text-ink dark:hover:text-dark-text"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Settings size={19} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <UsageWidget />
        </div>
      )}

      <div className="border-t border-surface-border dark:border-dark-border p-3">
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : "px-1 mb-2"}`}>
          <Avatar name={user?.name} email={user?.email} photo={user?.photo} size={34} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
                {user?.name}
              </p>
              <p className="text-xs text-ink-muted dark:text-dark-muted truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onLogoutClick}
          title="Log out"
          className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted dark:text-dark-muted hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-brand-red transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={17} />
          {!collapsed && "Log out"}
        </button>
      </div>
    </aside>
  );
}