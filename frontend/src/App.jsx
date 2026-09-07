import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { UsageProvider } from "./context/UsageContext";
import { EmailsProvider } from "./context/EmailsContext";
import { HistoryProvider } from "./context/HistoryContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";

import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback";
import { Dashboard } from "./pages/Dashboard";
import { Inbox } from "./pages/Inbox";
import { EmailPage } from "./pages/EmailPage";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { AIHome } from "./pages/AIHome";

function RootRedirect() {
  const { status } = useAuth();
  if (status === "loading") return null;
  return <Navigate to={status === "authenticated" ? "/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <AppShell>
              <Inbox />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/email/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <EmailPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppShell>
              <History />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AppShell>
              <AIHome />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <Settings />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <UsageProvider>
            <EmailsProvider>
              <HistoryProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </HistoryProvider>
            </EmailsProvider>
          </UsageProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
