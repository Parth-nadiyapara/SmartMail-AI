import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../common/Avatar";

export function ProfileMenu({ onLogoutClick }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full transition-shadow focus-visible:ring-2 focus-visible:ring-brand-blue"
      >
        <Avatar name={user.name} email={user.email} photo={user.photo} size={34} />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 mt-2 w-56 rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface shadow-lg py-1.5 z-40"
        >
          <div className="px-3.5 py-2.5 border-b border-surface-border dark:border-dark-border">
            <p className="text-sm font-medium text-ink dark:text-dark-text truncate">
              {user.name}
            </p>
            <p className="text-xs text-ink-muted dark:text-dark-muted truncate">
              {user.email}
            </p>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink dark:text-dark-text hover:bg-surface-hover dark:hover:bg-dark-surface2"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogoutClick();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-brand-red hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
