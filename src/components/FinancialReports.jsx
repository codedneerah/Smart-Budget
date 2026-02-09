import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

const FinancialReports = () => {
  const {
    expenses,
    income,
    getTotalExpenses,
    getTotalIncome,
    getExpensesByCategory,
    getIncomeByCategory,
    budgets,
    getBudgetUtilization
  } = useFinance();

  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate report data based on filters
  const reportData = useMemo(() => {
    const startDate = reportType === 'monthly'
      ? new Date(`${selectedMonth}-01`)
      : new Date(selectedYear, 0, 1);

    const endDate = reportType === 'monthly'
      ? new Date(new Date(startDate).setMonth(startDate.getMonth() + 1))
      : new Date(selectedYear + 1, 0, 1);

    // Filter transactions by date range
    const filteredExpenses = expenses.filter(exp =>
      new Date(exp.date) >= startDate && new Date(exp.date) < endDate
    );

    const filteredIncome = income.filter(inc =>
      new Date(inc.date) >= startDate && new Date(inc.date) < endDate
    );

    // Calculate totals
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    // Category breakdowns
    const expenseCategories = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category || 'Uncategorized'] = (acc[exp.category || 'Uncategorized'] || 0) + exp.amount;
      return acc;
    }, {});

    const incomeCategories = filteredIncome.reduce((acc, inc) => {
      acc[inc.category || 'Uncategorized'] = (acc[inc.category || 'Uncategorized'] || 0) + inc.amount;
      return acc;
    }, {});

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const monthExpenses = expenses.filter(exp =>
        new Date(exp.date) >= monthStart && new Date(exp.date) < monthEnd
      ).reduce((sum, exp) => sum + exp.amount, 0);

      const monthIncome = income.filter(inc =>
        new Date(inc.date) >= monthStart && new Date(inc.date) < monthEnd
      ).reduce((sum, inc) => sum + inc.amount, 0);

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        expenses: monthExpenses,
        income: monthIncome,
        net: monthIncome - monthExpenses
      });
    }

    return {
      totalExpenses,
      totalIncome,
      netIncome,
      expenseCategories,
      incomeCategories,
      monthlyTrends,
      transactionCount: filteredExpenses.length + filteredIncome.length
    };
  }, [expenses, income, reportType, selectedMonth, selectedYear]);

  const exportToPDF = () => {
    // Simple PDF export simulation - in a real app, you'd use a library like jsPDF
    const reportText = `
FINANCIAL REPORT
${reportType === 'monthly' ? `Month: ${selectedMonth}` : `Year: ${selectedYear}`}

SUMMARY:
Total Income: $${reportData.totalIncome.toFixed(2)}
Total Expenses: $${reportData.totalExpenses.toFixed(2)}
Net Income: $${reportData.netIncome.toFixed(2)}
Transactions: ${reportData.transactionCount}

EXPENSE CATEGORIES:
${Object.entries(reportData.expenseCategories)
  .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
  .join('\n')}

INCOME CATEGORIES:
${Object.entries(reportData.incomeCategories)
  .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
  .join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${reportType}-${selectedMonth || selectedYear}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFinancialHealthScore = () => {
    const { totalIncome, totalExpenses, netIncome } = reportData;

    if (totalIncome === 0) return { score: 0, label: 'No Data', color: '#6b7280' };

    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    let score = 50; // Base score

    // Savings rate scoring
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 5) score += 5;
    else if (savingsRate < 0) score -= 20;

    // Expense ratio scoring
    if (expenseRatio <= 50) score += 15;
    else if (expenseRatio <= 70) score += 5;
    else if (expenseRatio > 90) score -= 15;

    // Diversity bonus
    const categoryCount = Object.keys(reportData.expenseCategories).length;
    if (categoryCount > 5) score += 10;

    score = Math.max(0, Math.min(100, score));

    let label, color;
    if (score >= 80) { label = 'Excellent'; color = '#10b981'; }
    else if (score >= 60) { label = 'Good'; color = '#3b82f6'; }
    else if (score >= 40) { label = 'Fair'; color = '#f59e0b'; }
    else { label = 'Needs Improvement'; color = '#ef4444'; }

    return { score, label, color };
  };

  const healthScore = getFinancialHealthScore();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Financial Reports</h2>

        {/* Report Controls */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)'
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {reportType === 'monthly' ? (
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)'
                }}
              />
            </div>
          ) : (
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Year
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2020"
                max={new Date().getFullYear()}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  width: '100px'
                }}
              />
            </div>
          )}

          <button
            onClick={exportToPDF}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              marginTop: '1.5rem'
            }}
          >
            📄 Export Report
          </button>
        </div>

        {/* Financial Health Score */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Financial Health Score</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '1rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(${healthScore.color} ${healthScore.score}%, #e5e7eb 0%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'var(--bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: healthScore.color
                }}>
                  {healthScore.score}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text)',
                  textAlign: 'center'
                }}>
                  {healthScore.label}
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Savings Rate
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text)' }}>
                    {reportData.totalIncome > 0
                      ? ((reportData.netIncome / reportData.totalIncome) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Expense Ratio
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text)' }}>
                    {reportData.totalIncome > 0
                      ? ((reportData.totalExpenses / reportData.totalIncome) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Categories Used
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text)' }}>
                    {Object.keys(reportData.expenseCategories).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total Income
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              ${reportData.totalIncome.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total Expenses
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
              ${reportData.totalExpenses.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Net Income
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: reportData.netIncome >= 0 ? '#059669' : '#dc2626'
            }}>
              ${reportData.netIncome.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Transactions
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {reportData.transactionCount}
            </div>
          </div>
        </div>

        {/* Category Breakdowns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Expense Categories */}
          <div className="card">
            <h3>Expense Categories</h3>
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(reportData.expenseCategories).length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No expenses in this period
                </p>
              ) : (
                Object.entries(reportData.expenseCategories)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = reportData.totalExpenses > 0
                      ? (amount / reportData.totalExpenses) * 100
                      : 0;

                    return (
                      <div key={category} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--text)' }}>
                            {category}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {percentage.toFixed(1)}% of expenses
                          </div>
                        </div>
                        <div style={{
                          fontWeight: '600',
                          color: '#dc2626',
                          fontSize: '1.1rem'
                        }}>
                          ${amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Income Categories */}
          <div className="card">
            <h3>Income Categories</h3>
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(reportData.incomeCategories).length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No income in this period
                </p>
              ) : (
                Object.entries(reportData.incomeCategories)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = reportData.totalIncome > 0
                      ? (amount / reportData.totalIncome) * 100
                      : 0;

                    return (
                      <div key={category} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--text)' }}>
                            {category}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {percentage.toFixed(1)}% of income
                          </div>
                        </div>
                        <div style={{
                          fontWeight: '600',
                          color: '#10b981',
                          fontSize: '1.1rem'
                        }}>
                          ${amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3>6-Month Trend</h3>
          <div style={{
            marginTop: '1rem',
            overflowX: 'auto'
          }}>
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
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Month</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Income</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Expenses</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Net</th>
                </tr>
              </thead>
              <tbody>
                {reportData.monthlyTrends.map((trend, index) => (
                  <tr key={trend.month} style={{
                    borderBottom: index < reportData.monthlyTrends.length - 1 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: 'var(--bg)'
                  }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {trend.month}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981' }}>
                      ${trend.income.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#dc2626' }}>
                      ${trend.expenses.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: trend.net >= 0 ? '#059669' : '#dc2626'
                    }}>
                      ${trend.net.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
