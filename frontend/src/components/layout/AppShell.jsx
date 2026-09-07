import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { useUsage } from "../../context/UsageContext";
import { useEmails } from "../../context/EmailsContext";
import { useHistory } from "../../context/HistoryContext";

const TITLES = {
  "/dashboard": "Dashboard",
  "/inbox": "Inbox",
  "/history": "History",
  "/settings": "Settings",
  "/ai": "AI",
};

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const { logout } = useAuth();
  const { reset: resetUsage } = useUsage();
  const { clear: clearEmails } = useEmails();
  const { clear: clearHistory } = useHistory();
  const location = useLocation();
  const navigate = useNavigate();

  const isEmailDetail = location.pathname.startsWith("/email/");
  const title =
    TITLES[location.pathname] || (isEmailDetail ? "Email" : "SmartMail AI");

  const handleLogout = async () => {
    await logout();
    resetUsage();
    clearEmails();
    clearHistory();
    setConfirmingLogout(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-surface-bg dark:bg-dark-bg">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onLogoutClick={() => setConfirmingLogout(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopHeader onLogoutClick={() => setConfirmingLogout(true)} />
        <MobileHeader
          title={isEmailDetail ? "Email" : title}
          onBack={isEmailDetail ? () => navigate(-1) : undefined}
          onMenuClick={() => setMobileDrawerOpen(true)}
        />

        <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
      </div>

      <MobileBottomNav hidden={isEmailDetail} />

      <MobileNavDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onLogoutClick={() => {
          setMobileDrawerOpen(false);
          setConfirmingLogout(true);
        }}
      />

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