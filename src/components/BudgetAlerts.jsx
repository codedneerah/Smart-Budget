import { useFinance } from '../context/FinanceContext';

const BudgetAlerts = () => {
  const { getBudgetUtilization, getExpensesByCategory } = useFinance();

  const budgetUtilization = getBudgetUtilization();
  const expensesByCategory = getExpensesByCategory();

  const alerts = Object.entries(budgetUtilization)
    .filter(([category, data]) => data.percentage > 80)
    .sort((a, b) => b[1].percentage - a[1].percentage);

  const overspending = Object.entries(budgetUtilization)
    .filter(([category, data]) => data.spent > data.budget)
    .sort((a, b) => (b[1].spent - b[1].budget) - (a[1].spent - a[1].budget));

  return (
    <div className="card">
      <h3>Budget Alerts</h3>

      {alerts.length === 0 && overspending.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#10b981', padding: '1rem' }}>
          ✅ All budgets are under control!
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Overspending Alerts */}
          {overspending.map(([category, data]) => (
            <div
              key={`overspend-${category}`}
              style={{
                padding: '1rem',
                border: '1px solid #dc2626',
                borderRadius: '8px',
                background: '#fef2f2'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🚨</span>
                <h4 style={{ margin: 0, color: '#dc2626' }}>Budget Exceeded</h4>
              </div>
              <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>
                {category}: ${(data.spent - data.budget).toFixed(2)} over budget
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                Spent: ${data.spent.toFixed(2)} / Budget: ${data.budget.toFixed(2)}
              </p>
            </div>
          ))}

          {/* High Usage Warnings */}
          {alerts
            .filter(([category]) => !overspending.some(([cat]) => cat === category))
            .map(([category, data]) => (
            <div
              key={`warning-${category}`}
              style={{
                padding: '1rem',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                background: '#fffbeb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <h4 style={{ margin: 0, color: '#f59e0b' }}>Budget Warning</h4>
              </div>
              <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>
                {category}: {data.percentage.toFixed(1)}% of budget used
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                ${data.remaining.toFixed(2)} remaining
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Budget Summary */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>Budget Overview</h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {Object.entries(budgetUtilization).map(([category, data]) => (
            <div
              key={category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem',
                background: '#f9fafb',
                borderRadius: '4px'
              }}
            >
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{category}</span>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <div>${data.spent.toFixed(2)} / ${data.budget.toFixed(2)}</div>
                <div style={{
                  color: data.percentage > 100 ? '#dc2626' : data.percentage > 80 ? '#f59e0b' : '#10b981',
                  fontWeight: '500'
                }}>
                  {data.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetAlerts;
