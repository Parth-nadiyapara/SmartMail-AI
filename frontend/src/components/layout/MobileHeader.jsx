import { useNavigate } from "react-router-dom";
import { LogoCompact } from "../common/Logo";
import { Avatar } from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";

export function MobileHeader({ title, onBack, onMenuClick, hideProfile = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-surface dark:bg-dark-surface border-b border-surface-border dark:border-dark-border safe-top">
      <div className="flex items-center gap-2 min-w-0">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="h-9 w-9 -ml-2 flex items-center justify-center rounded-full text-ink dark:text-dark-text active:bg-surface-hover dark:active:bg-dark-surface2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            title="Open sidebar"
            className="h-11 w-11 -ml-2.5 flex items-center justify-center rounded-lg active:bg-surface-hover dark:active:bg-dark-surface2 focus-visible:ring-2 focus-visible:ring-brand-blue transition-colors"
          >
            <LogoCompact size={24} />
          </button>
        )}
        <h1 className="text-[15px] font-semibold text-ink dark:text-dark-text truncate">
          {title}
        </h1>
      </div>

      {!hideProfile && user && (
        <button onClick={() => navigate("/settings")} aria-label="Settings">
          <Avatar name={user.name} email={user.email} photo={user.photo} size={30} />
        </button>
      )}
    </header>
  );
}