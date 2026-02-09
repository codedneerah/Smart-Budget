import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseForm from "../components/ExpenseForm";
import Calculator from "../components/Calculator";
import Summary from "../components/Summary";
import SavingsGoals from "../components/SavingsGoals";
import BudgetAlerts from "../components/BudgetAlerts";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    getTotalExpenses,
    getTotalIncome,
    getNetBalance,
    getExpensesByCategory,
    getRecentTransactions,
    loading
  } = useFinance();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div>Loading your financial data...</div>
      </div>
    );
  }

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();
  const netBalance = getNetBalance();
  const expensesByCategory = getExpensesByCategory();
  const recentTransactions = getRecentTransactions(5);

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem"
      }}>
        <Summary
          title="Total Income"
          amount={totalIncome}
          color="#10b981"
          icon="💰"
        />
        <Summary
          title="Total Expenses"
          amount={totalExpenses}
          color="#dc2626"
          icon="💸"
        />
        <Summary
          title="Net Balance"
          amount={netBalance}
          color={netBalance >= 0 ? "#059669" : "#dc2626"}
          icon={netBalance >= 0 ? "📈" : "📉"}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          <button
            onClick={() => navigate('/expenses')}
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#f3f4f6"}
            onMouseOut={(e) => e.target.style.background = "#f9fafb"}
          >
            <span style={{ fontSize: "1.5rem" }}>➕</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Add Expense</span>
          </button>
          <button
            onClick={() => navigate('/income')}
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#f3f4f6"}
            onMouseOut={(e) => e.target.style.background = "#f9fafb"}
          >
            <span style={{ fontSize: "1.5rem" }}>💰</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Add Income</span>
          </button>
          <button
            onClick={() => navigate('/expenses')}
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#f3f4f6"}
            onMouseOut={(e) => e.target.style.background = "#f9fafb"}
          >
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>View Reports</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#f3f4f6"}
            onMouseOut={(e) => e.target.style.background = "#f9fafb"}
          >
            <span style={{ fontSize: "1.5rem" }}>⚙️</span>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Settings</span>
          </button>
        </div>
      </div>

      {/* Charts and Forms Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem"
      }}>
        {/* Expense Chart */}
        <div className="card">
          <h3>Expense Overview</h3>
          <ExpenseChart />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3>Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b", margin: "2rem 0" }}>
              No transactions yet. Add some expenses or income to get started!
            </p>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: transaction.type === 'income' ? '#f0fdf4' : '#fef2f2'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                      {transaction.title}
                    </div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center"
                    }}>
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: "600",
                    color: transaction.type === 'income' ? '#10b981' : '#dc2626',
                    fontSize: "1.1rem"
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Forms Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "2rem"
      }}>
        {/* Add Expense Form */}
        <div className="card">
          <ExpenseForm type="expense" />
        </div>

        {/* Add Income Form */}
        <div className="card">
          <ExpenseForm type="income" />
        </div>

        {/* Calculator */}
        <div className="card">
          <Calculator />
        </div>
      </div>

      {/* Savings Goals and Budget Alerts */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem"
      }}>
        <SavingsGoals />
        <BudgetAlerts />
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h3>Expense Breakdown by Category</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem"
          }}>
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div
                  key={category}
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    {category}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#dc2626" }}>
                    ${amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
