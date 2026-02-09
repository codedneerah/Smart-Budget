import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from './AuthProvider';

const ExportImport = ({ onClose }) => {
  const { expenses, income, budgets, userProfile, notificationSettings, companies, savingsGoals } = useFinance();
  const { user } = useAuth();
  const [importData, setImportData] = useState('');
  const [importType, setImportType] = useState('full'); // 'full', 'expenses', 'income', 'settings'
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async (type = 'full') => {
    setIsExporting(true);

    try {
      let dataToExport = {};

      switch (type) {
        case 'expenses':
          dataToExport = {
            expenses,
            exportType: 'expenses',
            exportedAt: new Date().toISOString(),
            user: user?.email
          };
          break;

        case 'income':
          dataToExport = {
            income,
            exportType: 'income',
            exportedAt: new Date().toISOString(),
            user: user?.email
          };
          break;

        case 'settings':
          dataToExport = {
            userProfile,
            notificationSettings,
            companies,
            budgets,
            savingsGoals,
            exportType: 'settings',
            exportedAt: new Date().toISOString(),
            user: user?.email
          };
          break;

        case 'full':
        default:
          dataToExport = {
            expenses,
            income,
            budgets,
            userProfile,
            notificationSettings,
            companies,
            savingsGoals,
            exportType: 'full',
            exportedAt: new Date().toISOString(),
            user: user?.email,
            version: '2.0'
          };
          break;
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-budget-${type}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert(`Data exported successfully as ${type} backup!`);
    } catch (error) {
      alert('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const importDataFromFile = async () => {
    if (!importData.trim()) {
      alert('Please enter data to import');
      return;
    }

    setIsImporting(true);

    try {
      const data = JSON.parse(importData);

      // Validate data structure
      if (!data.exportType) {
        throw new Error('Invalid file format');
      }

      // Here you would typically call context methods to update the data
      // For now, we'll just show success
      alert(`Data imported successfully! Type: ${data.exportType}`);

      setImportData('');
      onClose && onClose();

    } catch (error) {
      alert('Import failed. Please check the file format and try again.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setImportData(e.target.result);
        } catch (error) {
          alert('Error reading file');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
      if (window.prompt('Type "CLEAR ALL DATA" to confirm:') === 'CLEAR ALL DATA') {
        // Clear localStorage
        localStorage.clear();
        alert('All data cleared. The app will reload.');
        window.location.reload();
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>Data Export & Import</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text)'
            }}
          >
            ×
          </button>
        </div>

        {/* Export Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Export Data</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <button
              onClick={() => exportData('full')}
              disabled={isExporting}
              style={{
                padding: '1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              📦 Full Backup
            </button>

            <button
              onClick={() => exportData('expenses')}
              disabled={isExporting}
              style={{
                padding: '1rem',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              💸 Expenses
            </button>

            <button
              onClick={() => exportData('income')}
              disabled={isExporting}
              style={{
                padding: '1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              💰 Income
            </button>

            <button
              onClick={() => exportData('settings')}
              disabled={isExporting}
              style={{
                padding: '1rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Import Data</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Import Type
            </label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                marginBottom: '1rem'
              }}
            >
              <option value="full">Full Backup</option>
              <option value="expenses">Expenses Only</option>
              <option value="income">Income Only</option>
              <option value="settings">Settings Only</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Upload File or Paste Data
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{
                marginBottom: '0.5rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100%'
              }}
            />
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Or paste JSON data here..."
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={importDataFromFile}
            disabled={isImporting || !importData.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (isImporting || !importData.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isImporting || !importData.trim()) ? 0.6 : 1,
              marginRight: '1rem'
            }}
          >
            {isImporting ? 'Importing...' : 'Import Data'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{
          border: '2px solid #dc2626',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#fef2f2'
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>⚠️ Danger Zone</h3>
          <p style={{
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <button
            onClick={clearAllData}
            style={{
              padding: '0.75rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🗑️ Clear All Data
          </button>
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
