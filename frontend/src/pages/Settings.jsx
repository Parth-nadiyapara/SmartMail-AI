import { useState } from "react";
import { Sun, Moon, Monitor, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUsage } from "../context/UsageContext";
import { useEmails } from "../context/EmailsContext";
import { useHistory } from "../context/HistoryContext";
import { Avatar } from "../components/common/Avatar";
import { Button } from "../components/common/Button";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function Settings() {
  const { user, logout } = useAuth();
  const { mode, setTheme } = useTheme();
  const { usage, reset: resetUsage } = useUsage();
  const { clear: clearEmails } = useEmails();
  const { clear: clearHistory } = useHistory();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    resetUsage();
    clearEmails();
    clearHistory();
    setConfirmingLogout(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-10 space-y-6">
      <h1 className="text-[22px] md:text-[26px] font-bold text-ink dark:text-dark-text tracking-tight">
        Settings
      </h1>

      <section className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5">
        <h2 className="text-sm font-semibold text-ink-muted dark:text-dark-muted mb-4">
          Account
        </h2>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} email={user?.email} photo={user?.photo} size={48} />
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-ink dark:text-dark-text truncate">
              {user?.name}
            </p>
            <p className="text-sm text-ink-muted dark:text-dark-muted truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5">
        <h2 className="text-sm font-semibold text-ink-muted dark:text-dark-muted mb-4">
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 rounded-lg border py-4 text-sm font-medium transition-colors min-h-[44px] ${
                mode === value
                  ? "border-brand-blue bg-surface-selected dark:bg-dark-surface2 text-brand-blue"
                  : "border-surface-border dark:border-dark-border text-ink-muted dark:text-dark-muted hover:bg-surface-hover dark:hover:bg-dark-surface2"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5">
        <h2 className="text-sm font-semibold text-ink-muted dark:text-dark-muted mb-4">
          AI Usage
        </h2>
        {usage ? (
          <p className="text-sm text-ink dark:text-dark-text">
            {usage.analysisCount} / {usage.dailyAnalysisLimit} analyses used today
            {" — "}
            {usage.remaining} remaining
          </p>
        ) : (
          <p className="text-sm text-ink-muted dark:text-dark-muted">
            Analyze an email to see your usage.
          </p>
        )}
      </section>

      <section className="rounded-card border border-red-200 dark:border-red-900 bg-surface dark:bg-dark-surface p-5">
        <h2 className="text-sm font-semibold text-brand-red mb-3">Danger zone</h2>
        <Button variant="danger" icon={LogOut} onClick={() => setConfirmingLogout(true)}>
          Log out
        </Button>
      </section>

      <ConfirmDialog
        open={confirmingLogout}
        title="Log out of SmartMail AI?"
        description="You'll need to sign in with Google again to access your inbox."
        confirmLabel="Log out"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </div>
  );
}
