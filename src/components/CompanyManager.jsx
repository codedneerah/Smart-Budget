import { useState } from 'react';

const CompanyManager = ({ companies, onAdd, onRemove, onRename }) => {
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    if (onAdd(newCompanyName.trim())) {
      setNewCompanyName('');
      setIsAdding(false);
      alert('Company added successfully!');
    } else {
      alert('Company already exists!');
    }
  };

  const handleRemoveCompany = (company) => {
    if (company === 'Personal Finance') {
      alert('Cannot delete Personal Finance!');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${company}"?`)) {
      if (onRemove(company)) {
        alert('Company deleted successfully!');
      }
    }
  };

  const handleRenameCompany = (oldName) => {
    if (!editName.trim()) {
      alert('Please enter a new name');
      return;
    }

    if (editName.trim() === oldName) {
      setEditingCompany(null);
      setEditName('');
      return;
    }

    if (onRename(oldName, editName.trim())) {
      setEditingCompany(null);
      setEditName('');
      alert('Company renamed successfully!');
    } else {
      alert('Company name already exists!');
    }
  };

  const startEditing = (company) => {
    setEditingCompany(company);
    setEditName(company);
  };

  const cancelEditing = () => {
    setEditingCompany(null);
    setEditName('');
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Manage Companies</h3>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Add, remove, or rename your companies. Personal Finance cannot be deleted.
      </p>

      {/* Add Company Section */}
      <div style={{ marginBottom: '2rem' }}>
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>+</span>
            Add Company
          </button>
        ) : (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            maxWidth: '400px'
          }}>
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
            />
            <button
              onClick={handleAddCompany}
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCompanyName('');
              }}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Companies List */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {companies.map(company => (
          <div
            key={company}
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
            {editingCompany === company ? (
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleRenameCompany(company);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleRenameCompany(company)}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    opacity: 0.7
                  }}>
                    🏢
                  </span>
                  <span style={{
                    fontWeight: '500',
                    color: 'var(--text)',
                    fontSize: '1.1rem'
                  }}>
                    {company}
                  </span>
                  {company === 'Personal Finance' && (
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Default
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => startEditing(company)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      background: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--text)'
                    }}
                  >
                    Rename
                  </button>
                  {company !== 'Personal Finance' && (
                    <button
                      onClick={() => handleRemoveCompany(company)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #dc2626',
                        background: '#dc2626',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#64748b',
          fontStyle: 'italic'
        }}>
          No companies found. Add your first company above.
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
