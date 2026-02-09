import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ThemeToggle from '../components/ThemeToggle';
import ProfileForm from '../components/ProfileForm';
import CompanyManager from '../components/CompanyManager';
import NotificationSettings from '../components/NotificationSettings';
import ThemePreferences from '../components/ThemePreferences';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const {
    userProfile,
    updateUserProfile,
    notificationSettings,
    updateNotificationSettings,
    companies,
    addCompany,
    removeCompany,
    renameCompany
  } = useFinance();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'companies', label: 'Companies', icon: '🏢' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateUserProfile({
      name: formData.get('name'),
      email: formData.get('email')
    });
    alert('Profile updated successfully!');
  };

  const handleNotificationUpdate = (setting, value) => {
    updateNotificationSettings({ [setting]: value });
  };

  const handleAddCompany = () => {
    const companyName = prompt('Enter company name:');
    if (companyName && companyName.trim()) {
      if (addCompany(companyName.trim())) {
        alert('Company added successfully!');
      } else {
        alert('Company already exists!');
      }
    }
  };

  const handleRemoveCompany = (company) => {
    if (company === 'Personal Finance') {
      alert('Cannot delete Personal Finance!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${company}"?`)) {
      if (removeCompany(company)) {
        alert('Company deleted successfully!');
      }
    }
  };

  const handleRenameCompany = (oldName) => {
    const newName = prompt('Enter new company name:', oldName);
    if (newName && newName.trim() && newName !== oldName) {
      if (renameCompany(oldName, newName.trim())) {
        alert('Company renamed successfully!');
      } else {
        alert('Company name already exists!');
      }
    }
  };

  const exportData = () => {
    const data = {
      userProfile,
      notificationSettings,
      companies,
      expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
      income: JSON.parse(localStorage.getItem('income') || '[]'),
      budgets: JSON.parse(localStorage.getItem('budgets') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-budget-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (window.confirm('This will overwrite your current data. Continue?')) {
            localStorage.setItem('expenses', JSON.stringify(data.expenses || []));
            localStorage.setItem('income', JSON.stringify(data.income || []));
            localStorage.setItem('budgets', JSON.stringify(data.budgets || {}));
            window.location.reload();
          }
        } catch (error) {
          alert('Invalid file format!');
        }
      };
      reader.readAsText(file);
    }
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      if (prompt('Type "DELETE" to confirm:') === 'DELETE') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--text)" }}>Settings</h2>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "2rem",
          overflowX: "auto"
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1rem",
                border: "none",
                background: activeTab === tab.id ? "var(--primary)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text)",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                fontWeight: "500",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: "400px" }}>
          {activeTab === 'profile' && (
            <ProfileForm
              userProfile={userProfile}
              onUpdate={updateUserProfile}
            />
          )}

          {activeTab === 'companies' && (
            <CompanyManager
              companies={companies}
              onAdd={addCompany}
              onRemove={removeCompany}
              onRename={renameCompany}
            />
          )}

          {activeTab === 'themes' && (
            <ThemePreferences />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={notificationSettings}
              onUpdate={updateNotificationSettings}
            />
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3>Data Privacy & Export</h3>
              <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                Export your data or import from a backup file.
              </p>
              <div style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
                <button
                  onClick={exportData}
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    padding: "0.75rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  📥 Export Data
                </button>
                <div>
                  <label
                    style={{
                      background: "#f3f4f6",
                      color: "var(--text)",
                      padding: "0.75rem 1rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "inline-block",
                      fontWeight: "500"
                    }}
                  >
                    📤 Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3>Account Management</h3>
              <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                Manage your account settings and data.
              </p>
              <div style={{ maxWidth: "400px" }}>
                <button
                  onClick={deleteAccount}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "0.75rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                    width: "100%"
                  }}
                >
                  🗑️ Delete Account
                </button>
                <p style={{ fontSize: "0.875rem", color: "#dc2626", marginTop: "0.5rem" }}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
