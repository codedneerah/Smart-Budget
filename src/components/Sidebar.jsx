import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Expenses", path: "/expenses", icon: "💸" },
    { name: "Income", path: "/income", icon: "💰" },
    { name: "Insights", path: "/insights", icon: "📊" },
    { name: "Bookmarks", path: "/bookmarks", icon: "🔖" },
    { name: "History", path: "/history", icon: "📅" },
    { name: "Notes", path: "/notes", icon: "📝" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-220px",
          height: "100vh",
          width: "220px",
          background: "#1e293b",
          paddingTop: "4rem",
          transition: "left 0.3s ease",
          zIndex: 999,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          SmartBudget
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                color: isActive ? "#38bdf8" : "#fff",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                background: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
                fontWeight: isActive ? "600" : "normal",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                transition: "all 0.2s ease",
                border: isActive ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid transparent",
              })}
              aria-label={`Navigate to ${item.name}`}
            >
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
