import { useState, useMemo, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import SearchAndFilter from "../components/SearchAndFilter";

const Expenses = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    EXPENSE_CATEGORIES
  } = useFinance();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    tags: "",
    recurring: false,
    frequency: "monthly"
  });

  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(exp =>
        exp.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.dateTo));
    }

    // Amount range filter
    if (filters.amountMin) {
      filtered = filtered.filter(exp => exp.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      filtered = filtered.filter(exp => exp.amount <= parseFloat(filters.amountMax));
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, filters]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (formData.title || formData.amount) {
        setSaving(true);
        // Simulate save operation
        setTimeout(() => {
          setSaving(false);
          setSavedMessage("💾 Draft saved automatically");
          setTimeout(() => setSavedMessage(""), 3000);
        }, 500);
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [formData]);

  const handleBulkAction = () => {
    if (!bulkAction || selectedExpenses.length === 0) return;

    if (bulkAction === 'delete') {
      if (window.confirm(`🗑️ Delete ${selectedExpenses.length} selected expenses?`)) {
        selectedExpenses.forEach(id => deleteExpense(id));
        setSelectedExpenses([]);
        setSavedMessage(`✅ ${selectedExpenses.length} expenses deleted!`);
        setTimeout(() => setSavedMessage(""), 3000);
      }
    } else if (bulkAction === 'export') {
      const selectedData = expenses.filter(exp => selectedExpenses.includes(exp.id));
      const csvContent = [
        ['Title', 'Amount', 'Category', 'Date', 'Description', 'Tags'],
        ...selectedData.map(exp => [
          exp.title,
          exp.amount,
          exp.category,
          exp.date,
          exp.description,
          exp.tags?.join(', ')
        ])
      ].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setSavedMessage("📊 Expenses exported successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    }
    setBulkAction("");
  };

  const toggleExpenseSelection = (id) => {
    setSelectedExpenses(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const selectAllExpenses = () => {
    if (selectedExpenses.length === filteredExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(filteredExpenses.map(exp => exp.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount) return;

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      type: 'expense'
    };

    if (editingId) {
      updateExpense(editingId, expenseData);
      setEditingId(null);
    } else {
      addExpense(expenseData);
    }

    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title || "",
      amount: expense.amount?.toString() || "",
      category: expense.category || "",
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: expense.description || ""
    });
    setEditingId(expense.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  const totalAmount = filteredExpenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
  const totalBudget = filteredExpenses.reduce((acc, exp) => acc + (exp.budget || 0), 0);
  const totalSpent = filteredExpenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Expenses Management</h2>

        {/* Add/Edit Form */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>{editingId ? '✏️ Edit Expense' : '➕ Add New Expense'}</h3>
            {savedMessage && (
              <div style={{
                padding: '0.5rem 1rem',
                background: savedMessage.includes('✅') ? '#d1fae5' : savedMessage.includes('❌') ? '#fee2e2' : '#fef3c7',
                color: savedMessage.includes('✅') ? '#065f46' : savedMessage.includes('❌') ? '#991b1b' : '#92400e',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                animation: 'fadeIn 0.3s ease'
              }}>
                {savedMessage}
              </div>
            )}
          </div>

          {!showForm && !editingId && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ➕ Add New Expense
              </button>
            </div>
          )}

          {(showForm || editingId) && (
            <form onSubmit={handleSubmit} style={{ animation: 'slideDown 0.3s ease' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Expense title"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Amount *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--muted)',
                      fontSize: '0.875rem'
                    }}>$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 1.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">Select category</option>
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: 'var(--text)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="work, travel, food..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: 'var(--text)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <span style={{ color: 'var(--text)', fontSize: '0.875rem', fontWeight: '500' }}>
                    🔄 Recurring Expense
                  </span>
                </label>
                {formData.recurring && (
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: saving ? '#6b7280' : 'linear-gradient(135deg, var(--primary), #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {saving ? '💾' : editingId ? '✏️' : '➕'}
                  {saving ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
                </button>

                {(editingId || showForm) && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#4b5563'}
                    onMouseOut={(e) => e.target.style.background = '#6b7280'}
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          onFilterChange={setFilters}
          showCategories={true}
          showDateRange={true}
          showAmountRange={true}
        />

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total Expenses
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
              ${totalAmount.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Filtered Results
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {filteredExpenses.length}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Average Amount
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              ${filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>Expenses List</h3>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Showing {filteredExpenses.length} of {expenses.length} expenses
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {expenses.length === 0 ? 'No expenses yet' : 'No expenses match your filters'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {expenses.length === 0 ? 'Add your first expense to get started!' : 'Try adjusting your search or filter criteria.'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'var(--bg)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{
                    background: 'var(--primary)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: 'var(--bg)'
                    }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>
                        {expense.title}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {expense.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                        ${expense.amount?.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '200px' }}>
                        <div style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {expense.description || '-'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(expense)}
                            style={{
                              padding: '0.5rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            style={{
                              padding: '0.5rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
