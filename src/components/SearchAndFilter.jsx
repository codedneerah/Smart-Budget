import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';

const SearchAndFilter = ({ onFilterChange, showCategories = true, showDateRange = true, showAmountRange = true }) => {
  const { EXPENSE_CATEGORIES, INCOME_CATEGORIES } = useFinance();
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

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
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
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== 'date' && value !== 'desc'
  );

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              paddingLeft: '2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontSize: '1.1rem'
          }}>
            🔍
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>⚙️</span>
          <span>Filters</span>
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #dc2626',
              borderRadius: '8px',
              backgroundColor: '#dc2626',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Type Filter */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Transaction Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)'
                }}
              >
                <option value="">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category Filter */}
            {showCategories && (
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
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)'
                  }}
                >
                  <option value="">All Categories</option>
                  {[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range */}
            {showDateRange && (
              <>
                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)'
                    }}
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
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)'
                    }}
                  />
                </div>
              </>
            )}

            {/* Amount Range */}
            {showAmountRange && (
              <>
                <div>
                  <label style={{
                    display: 'block',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={filters.amountMin}
                    onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)'
                    }}
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
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="9999.99"
                    value={filters.amountMax}
                    onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)'
                    }}
                  />
                </div>
              </>
            )}

            {/* Sort Options */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)'
                }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
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
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)'
                }}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {filters.search && (
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Search: "{filters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e40af',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: 0,
                  marginLeft: '0.25rem'
                }}
              >
                ×
              </button>
            </span>
          )}

          {filters.type && (
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Type: {filters.type}
              <button
                onClick={() => handleFilterChange('type', '')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#166534',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: 0,
                  marginLeft: '0.25rem'
                }}
              >
                ×
              </button>
            </span>
          )}

          {filters.category && (
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#92400e',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: 0,
                  marginLeft: '0.25rem'
                }}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
