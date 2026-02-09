import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "./AuthProvider";
import "./Topbar.css";

const Topbar = ({ pageTitle, toggleSidebar, isDashboard }) => {
  const { companies, currentCompany, addCompany, removeCompany, renameCompany, switchCompany } = useFinance();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const companyDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
        setEditingCompany(null);
        setNewCompanyName("");
      }
    };

    if (showProfile || showNotifications || showCompanyDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile, showNotifications, showCompanyDropdown]);

  const handleAvatarClick = () => {
    setShowProfile(!showProfile);
  };

  const handleAvatarKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setShowProfile(!showProfile);
    }
  };

  const handleMenuItemClick = (action) => {
    setShowProfile(false);
    if (action === "Profile" || action === "Settings") {
      navigate("/settings");
    } else if (action === "Logout") {
      logout();
    }
  };

  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="toggle-sidebar-btn"
        >
          ☰
        </button>
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      {/* CENTER — DASHBOARD ONLY */}
      {isDashboard && (
        <div className="company-selector-container" ref={companyDropdownRef}>
          <button
            className="company-selector-btn"
            onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
            aria-expanded={showCompanyDropdown}
            aria-haspopup="listbox"
            aria-label={`Current company: ${currentCompany}. Click to switch companies`}
          >
            <span className="company-name">{currentCompany}</span>
            <span className="dropdown-arrow">{showCompanyDropdown ? '▲' : '▼'}</span>
          </button>

          {showCompanyDropdown && (
            <div className="company-dropdown" role="listbox">
              {companies.map((company) => (
                <div key={company} className="company-option-container">
                  {editingCompany === company ? (
                    <div className="company-edit-mode">
                      <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (renameCompany(company, newCompanyName)) {
                              setEditingCompany(null);
                              setNewCompanyName("");
                            }
                          } else if (e.key === 'Escape') {
                            setEditingCompany(null);
                            setNewCompanyName("");
                          }
                        }}
                        autoFocus
                        aria-label={`Rename ${company}`}
                      />
                      <button
                        onClick={() => {
                          if (renameCompany(company, newCompanyName)) {
                            setEditingCompany(null);
                            setNewCompanyName("");
                          }
                        }}
                        aria-label="Save company name"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingCompany(null);
                          setNewCompanyName("");
                        }}
                        aria-label="Cancel editing"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`company-option ${currentCompany === company ? 'active' : ''}`}
                      onClick={() => {
                        switchCompany(company);
                        setShowCompanyDropdown(false);
                      }}
                      role="option"
                      aria-selected={currentCompany === company}
                    >
                      <span>{company}</span>
                      <div className="company-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCompany(company);
                            setNewCompanyName(company);
                          }}
                          aria-label={`Edit ${company}`}
                          className="edit-btn"
                        >
                          ✏️
                        </button>
                        {company !== 'Personal Finance' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (removeCompany(company)) {
                                setShowCompanyDropdown(false);
                              }
                            }}
                            aria-label={`Delete ${company}`}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="add-company-section">
                <input
                  type="text"
                  placeholder="New company name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCompanyName.trim()) {
                      if (addCompany(newCompanyName.trim())) {
                        setNewCompanyName("");
                      }
                    }
                  }}
                  aria-label="Enter new company name"
                />
                <button
                  onClick={() => {
                    if (newCompanyName.trim() && addCompany(newCompanyName.trim())) {
                      setNewCompanyName("");
                    }
                  }}
                  disabled={!newCompanyName.trim()}
                  aria-label="Add new company"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RIGHT — DASHBOARD ONLY */}
      {isDashboard && (
        <div className="topbar-right">
          <ThemeToggle />
          <div style={{ position: "relative" }} ref={notificationsRef}>
            <button
              className="icon-btn"
              title="Notifications"
              aria-label="View notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-expanded={showNotifications}
              aria-haspopup="menu"
            >
              🔔
            </button>
            {showNotifications && (
              <div className="notifications-dropdown" role="menu">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="close-btn"
                    aria-label="Close notifications"
                  >
                    ×
                  </button>
                </div>
                <div className="notifications-list">
                  <div className="notification-item unread">
                    <div className="notification-icon">💰</div>
                    <div className="notification-content">
                      <div className="notification-title">Budget Alert</div>
                      <div className="notification-message">You've exceeded your monthly budget by $50</div>
                      <div className="notification-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">📊</div>
                    <div className="notification-content">
                      <div className="notification-title">Monthly Report</div>
                      <div className="notification-message">Your financial report for November is ready</div>
                      <div className="notification-time">1 day ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">🎯</div>
                    <div className="notification-content">
                      <div className="notification-title">Goal Achieved</div>
                      <div className="notification-message">Congratulations! You've reached your savings goal</div>
                      <div className="notification-time">3 days ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">💡</div>
                    <div className="notification-content">
                      <div className="notification-title">Tip of the Day</div>
                      <div className="notification-message">Try setting up automatic savings transfers</div>
                      <div className="notification-time">1 week ago</div>
                    </div>
                  </div>
                </div>
                <div className="notifications-footer">
                  <button className="view-all-btn">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <div
              className="avatar"
              onClick={handleAvatarClick}
              onKeyDown={handleAvatarKeyDown}
              tabIndex={0}
              role="button"
              aria-expanded={showProfile}
              aria-haspopup="menu"
              aria-label="User profile menu"
            >
              MU
            </div>
            {showProfile && (
              <div className="dropdown" ref={dropdownRef} role="menu">
                <div
                  className="menu-item"
                  onClick={() => handleMenuItemClick("Profile")}
                  role="menuitem"
                  tabIndex={0}
                >
                  Profile
                </div>
                <div
                  className="menu-item"
                  onClick={() => handleMenuItemClick("Settings")}
                  role="menuitem"
                  tabIndex={0}
                >
                  Settings
                </div>
                <div
                  className="menu-item"
                  onClick={() => handleMenuItemClick("Logout")}
                  role="menuitem"
                  tabIndex={0}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
