import { useState } from 'react';

const NotificationSettings = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key) => {
    const newSettings = {
      ...localSettings,
      [key]: !localSettings[key]
    };
    setLocalSettings(newSettings);
    onUpdate(newSettings);
  };

  const notificationOptions = [
    {
      key: 'budgetAlerts',
      title: 'Budget Alerts',
      description: 'Get notified when you exceed budget limits',
      icon: '💰'
    },
    {
      key: 'transactionNotifications',
      title: 'Transaction Notifications',
      description: 'Receive notifications for new transactions',
      icon: '📊'
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Reports',
      description: 'Weekly summary of your finances',
      icon: '📈'
    },
    {
      key: 'monthlyReports',
      title: 'Monthly Reports',
      description: 'Monthly financial reports',
      icon: '📅'
    },
    {
      key: 'goalReminders',
      title: 'Goal Reminders',
      description: 'Reminders about your savings goals',
      icon: '🎯'
    },
    {
      key: 'lowBalanceAlerts',
      title: 'Low Balance Alerts',
      description: 'Alerts when account balance is low',
      icon: '⚠️'
    }
  ];

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Notification Settings</h3>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Configure when and how you receive notifications.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {notificationOptions.map(option => (
          <div
            key={option.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'var(--bg)',
              transition: 'box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
              <div>
                <div style={{
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: 'var(--text)',
                  fontSize: '1.1rem'
                }}>
                  {option.title}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.4'
                }}>
                  {option.description}
                </div>
              </div>
            </div>

            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '50px',
              height: '24px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={localSettings[option.key] || false}
                onChange={() => handleToggle(option.key)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: (localSettings[option.key] || false) ? 'var(--primary)' : '#cbd5e1',
                transition: 'background-color 0.3s ease',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '18px',
                  width: '18px',
                  left: (localSettings[option.key] || false) ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: 'left 0.3s ease',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}></span>
              </span>
            </label>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>Notification Preferences</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
          You can manage additional notification preferences in your device settings.
          Some notifications may require browser permissions to be enabled.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
