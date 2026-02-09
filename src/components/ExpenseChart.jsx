import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useFinance } from "../context/FinanceContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1'];

const ExpenseChart = () => {
  const { expenses, getExpensesByCategory, getTotalIncome, getTotalExpenses } = useFinance();
  const [chartType, setChartType] = useState('line'); // 'line', 'pie', 'bar'

  // Prepare data for different chart types
  const lineChartData = expenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((exp, idx) => ({
      name: exp.title.length > 15 ? exp.title.substring(0, 15) + '...' : exp.title,
      amount: Number(exp.amount),
      date: new Date(exp.date).toLocaleDateString(),
      fullTitle: exp.title
    }));

  const pieChartData = Object.entries(getExpensesByCategory()).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / getTotalExpenses()) * 100).toFixed(1)
  }));

  const barChartData = [
    { name: 'Income', amount: getTotalIncome(), color: '#10b981' },
    { name: 'Expenses', amount: getTotalExpenses(), color: '#dc2626' },
    { name: 'Net Balance', amount: getTotalIncome() - getTotalExpenses(), color: '#2563eb' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      if (chartType === 'pie') {
        return (
          <div style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.name}</p>
            <p style={{ margin: 0, color: '#666' }}>
              ${payload[0].value.toFixed(2)} ({payload[0].payload.percentage}%)
            </p>
          </div>
        );
      }

      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: payload[0].color }}>
            ${payload[0].value.toFixed(2)}
          </p>
          {payload[0].payload?.date && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
              {payload[0].payload.date}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 6, fill: '#38bdf8' }}
                activeDot={{ r: 8, fill: '#0ea5e9' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const hasData = chartType === 'pie' ? pieChartData.length > 0 :
                  chartType === 'bar' ? true : lineChartData.length > 0;

  return (
    <div>
      {/* Chart Type Selector */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        justifyContent: 'center'
      }}>
        {[
          { key: 'line', label: '📈 Trend', desc: 'Expense Timeline' },
          { key: 'pie', label: '🥧 Categories', desc: 'Expense Breakdown' },
          { key: 'bar', label: '📊 Overview', desc: 'Income vs Expenses' }
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setChartType(key)}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${chartType === key ? '#38bdf8' : '#e5e7eb'}`,
              borderRadius: '8px',
              backgroundColor: chartType === key ? '#f0f9ff' : '#fff',
              color: chartType === key ? '#0ea5e9' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: chartType === key ? '600' : '400',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>{label}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '400' }}>{desc}</span>
          </button>
        ))}
      </div>

      {/* Chart Display */}
      {hasData ? (
        renderChart()
      ) : (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '1.1rem'
        }}>
          {chartType === 'pie' ? 'No expense categories to display' :
           chartType === 'bar' ? 'Add some income and expenses to see the overview' :
           'Add some expenses to see the trend chart'}
        </div>
      )}

      {/* Chart Summary */}
      {hasData && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#475569'
        }}>
          {chartType === 'pie' && pieChartData.length > 0 && (
            <div>
              <strong>Top Categories:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                {pieChartData.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    {item.name}: ${item.value.toFixed(2)} ({item.percentage}%)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {chartType === 'bar' && (
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                  Income: ${getTotalIncome().toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#dc2626' }}>
                  Expenses: ${getTotalExpenses().toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  color: (getTotalIncome() - getTotalExpenses()) >= 0 ? '#059669' : '#dc2626'
                }}>
                  Balance: ${(getTotalIncome() - getTotalExpenses()).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {chartType === 'line' && lineChartData.length > 0 && (
            <div>
              <strong>Latest Expense:</strong> {lineChartData[lineChartData.length - 1]?.fullTitle} -
              ${lineChartData[lineChartData.length - 1]?.amount.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
