import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext";

const Insights = () => {
  const {
    expenses,
    income,
    getTotalExpenses,
    getTotalIncome,
    getExpensesByCategory,
    getNetBalance,
    getBudgetUtilization
  } = useFinance();

  const insights = useMemo(() => {
    const totalExpenses = getTotalExpenses();
    const totalIncome = getTotalIncome();
    const netBalance = getNetBalance();
    const expensesByCategory = getExpensesByCategory();
    const budgetUtilization = getBudgetUtilization();

    const insightsList = [];

    // Basic financial health
    if (totalIncome === 0 && totalExpenses === 0) {
      insightsList.push({
        type: 'info',
        icon: '📝',
        title: 'Welcome to Smart Budget Tracker!',
        message: 'Start by adding your income and expenses to get personalized insights.',
        priority: 'high'
      });
    }

    // Income vs Expenses analysis
    if (totalIncome > 0) {
      const expenseRatio = (totalExpenses / totalIncome) * 100;

      if (expenseRatio > 80) {
        insightsList.push({
          type: 'warning',
          icon: '⚠️',
          title: 'High Expense Ratio',
          message: `You're spending ${expenseRatio.toFixed(1)}% of your income. Consider reducing expenses or increasing income.`,
          priority: 'high'
        });
      } else if (expenseRatio < 50) {
        insightsList.push({
          type: 'success',
          icon: '🎉',
          title: 'Great Financial Discipline!',
          message: `You're only spending ${expenseRatio.toFixed(1)}% of your income. Keep up the excellent savings!`,
          priority: 'medium'
        });
      }
    }

    // Net balance insights
    if (netBalance < 0) {
      insightsList.push({
        type: 'danger',
        icon: '📉',
        title: 'Negative Balance Alert',
        message: `You're spending $${Math.abs(netBalance).toFixed(2)} more than you earn. Review your expenses immediately.`,
        priority: 'high'
      });
    } else if (netBalance > totalIncome * 0.2) {
      insightsList.push({
        type: 'success',
        icon: '💰',
        title: 'Strong Savings',
        message: `You're saving $${netBalance.toFixed(2)} this period. Consider investing or building an emergency fund.`,
        priority: 'medium'
      });
    }

    // Category analysis
    const topCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      const [category, amount] = topCategory;
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

      if (percentage > 50) {
        insightsList.push({
          type: 'warning',
          icon: '🎯',
          title: 'High Category Spending',
          message: `${category} accounts for ${percentage.toFixed(1)}% of your expenses. Consider diversifying your spending.`,
          priority: 'medium'
        });
      }
    }

    // Budget alerts
    Object.entries(budgetUtilization).forEach(([category, data]) => {
      if (data.percentage > 100) {
        insightsList.push({
          type: 'danger',
          icon: '🚨',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${category} budget by $${(data.spent - data.budget).toFixed(2)}.`,
          priority: 'high'
        });
      } else if (data.percentage > 80) {
        insightsList.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Budget Warning',
          message: `${category} budget is ${data.percentage.toFixed(1)}% used. $${data.remaining.toFixed(2)} remaining.`,
          priority: 'medium'
        });
      }
    });

    // Transaction frequency insights
    const recentExpenses = expenses.filter(exp =>
      new Date(exp.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (recentExpenses.length > 0) {
      const avgDaily = recentExpenses.length / 30;
      if (avgDaily > 2) {
        insightsList.push({
          type: 'info',
          icon: '📊',
          title: 'Frequent Transactions',
          message: `You're making ${avgDaily.toFixed(1)} transactions per day. Track your spending patterns.`,
          priority: 'low'
        });
      }
    }

    // Savings suggestions
    if (totalIncome > 0 && netBalance > 0) {
      const savingsRate = (netBalance / totalIncome) * 100;
      if (savingsRate < 20) {
        insightsList.push({
          type: 'suggestion',
          icon: '💡',
          title: 'Savings Opportunity',
          message: `Aim to save at least 20% of your income. You're currently at ${savingsRate.toFixed(1)}%.`,
          priority: 'medium'
        });
      }
    }

    // Seasonal or pattern insights
    const currentMonth = new Date().getMonth();
    const monthlyExpenses = expenses.filter(exp =>
      new Date(exp.date).getMonth() === currentMonth
    );

    if (monthlyExpenses.length > 10) {
      insightsList.push({
        type: 'info',
        icon: '📅',
        title: 'Active Month',
        message: `You've recorded ${monthlyExpenses.length} transactions this month. Keep tracking!`,
        priority: 'low'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    insightsList.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    return insightsList.slice(0, 8); // Limit to 8 insights
  }, [expenses, income]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#3b82f6';
      case 'suggestion': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return { text: 'High', color: '#ef4444' };
      case 'medium': return { text: 'Medium', color: '#f59e0b' };
      case 'low': return { text: 'Low', color: '#10b981' };
      default: return { text: 'Info', color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{
        marginBottom: "1.5rem",
        color: "#1f2937",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span>🧠</span>
        AI Financial Insights
      </h3>

      {insights.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#6b7280",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "2px dashed #e5e7eb"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h4 style={{ marginBottom: "0.5rem", color: "#374151" }}>
            No Insights Yet
          </h4>
          <p>Add some income and expenses to get personalized financial insights and suggestions.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {insights.map((insight, index) => {
            const badge = getPriorityBadge(insight.priority);
            return (
              <div
                key={index}
                style={{
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: `2px solid ${getTypeColor(insight.type)}20`,
                  backgroundColor: `${getTypeColor(insight.type)}08`,
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Priority Badge */}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: badge.color,
                  color: "#fff",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  textTransform: "uppercase"
                }}>
                  {badge.text}
                </div>

                {/* Icon and Title */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.5rem" }}>{insight.icon}</span>
                  <h4 style={{
                    margin: 0,
                    color: getTypeColor(insight.type),
                    fontSize: "1.1rem",
                    fontWeight: "600"
                  }}>
                    {insight.title}
                  </h4>
                </div>

                {/* Message */}
                <p style={{
                  margin: 0,
                  color: "#4b5563",
                  lineHeight: "1.5",
                  fontSize: "0.95rem"
                }}>
                  {insight.message}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {insights.length > 0 && (
        <div style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e5e7eb"
        }}>
          <h4 style={{ marginBottom: "1rem", color: "#1f2937" }}>
            📈 Quick Stats
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>
                {insights.filter(i => i.type === 'success').length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Positive</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>
                {insights.filter(i => i.type === 'warning').length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Warnings</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ef4444" }}>
                {insights.filter(i => i.type === 'danger').length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Alerts</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6" }}>
                {insights.filter(i => i.type === 'suggestion').length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Tips</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
