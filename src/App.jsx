import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { FinanceProvider } from "./context/FinanceContext";
import { AuthProvider, useAuth } from "./components/AuthProvider";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Insights from "./pages/InsightsPage";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";
import Notes from "./components/Notes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === "/";

  const pageTitleMap = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/expenses": "Expenses",
    "/income": "Income",
    "/insights": "Insights",
    "/bookmarks": "Bookmarks",
    "/history": "History",
    "/notes": "Notes",
    "/settings": "Settings",
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, show auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated, show main app
  return (
    <>
      {/* ✅ SINGLE TOPBAR */}
      <Topbar
        pageTitle={pageTitleMap[location.pathname]}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isDashboard={isDashboard}
      />

      {/* ✅ SINGLE SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main
        style={{
          marginLeft: sidebarOpen ? "220px" : "0",
          transition: "margin-left 0.3s ease",
          padding: "1.5rem",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/history" element={<History />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <AppContent />
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}
