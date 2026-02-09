import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Categories for expenses
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

// Income categories
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other'
];

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [currentContext, setCurrentContext] = useState('personal'); // 'personal' or 'company'
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState(['Personal Finance', 'SmartBudget Ltd']);
  const [currentCompany, setCurrentCompany] = useState('Personal Finance');
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: 'user@example.com',
    avatar: null
  });
  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    transactionNotifications: true,
    weeklyReports: false,
    monthlyReports: true
  });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [themePreferences, setThemePreferences] = useState({
    mode: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    density: 'comfortable',
    animations: true,
    accentColor: '#38bdf8',
    highContrast: false
  });
  const [currency, setCurrency] = useState(localStorage.getItem('selectedCurrency') || 'USD');
  const [currencyRates, setCurrencyRates] = useState({
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    INR: 74.5,
    BRL: 5.2,
    MXN: 20.0,
    KRW: 1180.0,
    SGD: 1.35,
    NZD: 1.4,
    ZAR: 14.8,
    TRY: 8.5,
    RUB: 75.0,
    HKD: 7.8,
    SEK: 8.6,
    NOK: 8.8,
    DKK: 6.3,
    PLN: 3.8,
    CZK: 21.5,
    HUF: 300.0,
    ILS: 3.2,
    EGP: 15.7,
    SAR: 3.75,
    AED: 3.67,
    THB: 33.0,
    MYR: 4.15,
    IDR: 14000.0,
    PHP: 50.0,
    VND: 23000.0,
    PKR: 155.0,
    BDT: 85.0,
    LKR: 200.0,
    NGN: 410.0,
    KES: 110.0,
    UGX: 3700.0,
    TZS: 2300.0,
    GHS: 6.0,
    XAF: 600.0,
    XOF: 600.0
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const savedIncome = JSON.parse(localStorage.getItem('income') || '[]');
      const savedBudgets = JSON.parse(localStorage.getItem('budgets') || '{}');

      setExpenses(savedExpenses);
      setIncome(savedIncome);
      setBudgets(savedBudgets);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Add expense
  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString(),
      type: 'expense'
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

  // Add income
  const addIncome = (incomeData) => {
    const newIncome = {
      id: Date.now().toString(),
      ...incomeData,
      date: incomeData.date || new Date().toISOString(),
      type: 'income'
    };
    setIncome(prev => [...prev, newIncome]);
    return newIncome;
  };

  // Update expense
  const updateExpense = (id, updatedData) => {
    setExpenses(prev => prev.map(exp =>
      exp.id === id ? { ...exp, ...updatedData } : exp
    ));
  };

  // Update income
  const updateIncome = (id, updatedData) => {
    setIncome(prev => prev.map(inc =>
      inc.id === id ? { ...inc, ...updatedData } : inc
    ));
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Delete income
  const deleteIncome = (id) => {
    setIncome(prev => prev.filter(inc => inc.id !== id));
  };

  // Set budget for category
  const setBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
  };

  // Get total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((total, exp) => total + (exp.amount || 0), 0);
  };

  // Get total income
  const getTotalIncome = () => {
    return income.reduce((total, inc) => total + (inc.amount || 0), 0);
  };

  // Get expenses by category
  const getExpensesByCategory = () => {
    return expenses.reduce((acc, exp) => {
      const category = exp.category || 'Other';
      acc[category] = (acc[category] || 0) + (exp.amount || 0);
      return acc;
    }, {});
  };

  // Get income by category
  const getIncomeByCategory = () => {
    return income.reduce((acc, inc) => {
      const category = inc.category || 'Other';
      acc[category] = (acc[category] || 0) + (inc.amount || 0);
      return acc;
    }, {});
  };

  // Get net balance
  const getNetBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  // Get budget utilization
  const getBudgetUtilization = () => {
    const expensesByCategory = getExpensesByCategory();
    const utilization = {};

    Object.keys(budgets).forEach(category => {
      const spent = expensesByCategory[category] || 0;
      const budget = budgets[category] || 0;
      utilization[category] = {
        spent,
        budget,
        remaining: budget - spent,
        percentage: budget > 0 ? (spent / budget) * 100 : 0
      };
    });

    return utilization;
  };

  // Get recent transactions (combined expenses and income)
  const getRecentTransactions = (limit = 10) => {
    const allTransactions = [
      ...expenses.map(exp => ({ ...exp, type: 'expense' })),
      ...income.map(inc => ({ ...inc, type: 'income' }))
    ];

    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Company management functions
  const addCompany = (companyName) => {
    if (!companies.includes(companyName)) {
      setCompanies(prev => [...prev, companyName]);
      return true;
    }
    return false;
  };

  const removeCompany = (companyName) => {
    if (companies.length > 1 && companyName !== 'Personal Finance') {
      setCompanies(prev => prev.filter(c => c !== companyName));
      if (currentCompany === companyName) {
        setCurrentCompany('Personal Finance');
      }
      return true;
    }
    return false;
  };

  const renameCompany = (oldName, newName) => {
    if (!companies.includes(newName) && newName.trim()) {
      setCompanies(prev => prev.map(c => c === oldName ? newName : c));
      if (currentCompany === oldName) {
        setCurrentCompany(newName);
      }
      return true;
    }
    return false;
  };

  const switchContext = (context) => {
    setCurrentContext(context);
  };

  const switchCompany = (companyName) => {
    if (companies.includes(companyName)) {
      setCurrentCompany(companyName);
      return true;
    }
    return false;
  };

  // Get transaction history with activity logging
  const getTransactionHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    } catch {
      return [];
    }
  };

  // Get bookmarked transactions
  const getBookmarkedTransactions = () => {
    const allTransactions = getRecentTransactions(1000);
    return allTransactions.filter(t => t.bookmarked);
  };

  // Toggle bookmark on transaction
  const toggleBookmark = (transactionId) => {
    const updateTransaction = (transactions, setTransactions) => {
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? { ...t, bookmarked: !t.bookmarked } : t
      ));
    };

    // Update in expenses or income arrays
    const expense = expenses.find(e => e.id === transactionId);
    const incomeItem = income.find(i => i.id === transactionId);

    if (expense) {
      updateExpense(transactionId, { bookmarked: !expense.bookmarked });
    } else if (incomeItem) {
      updateIncome(transactionId, { bookmarked: !incomeItem.bookmarked });
    }
  };

  // User profile management
  const updateUserProfile = (profileData) => {
    setUserProfile(prev => ({ ...prev, ...profileData }));
  };

  // Notification settings management
  const updateNotificationSettings = (settings) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  // Savings goals management
  const addSavingsGoal = (goalData) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goalData,
      createdAt: new Date().toISOString(),
      currentAmount: 0
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateSavingsGoal = (id, updatedData) => {
    setSavingsGoals(prev => prev.map(goal =>
      goal.id === id ? { ...goal, ...updatedData } : goal
    ));
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addToSavingsGoal = (id, amount) => {
    setSavingsGoals(prev => prev.map(goal =>
      goal.id === id ? { ...goal, currentAmount: goal.currentAmount + amount } : goal
    ));
  };

  // Theme preferences management
  const updateThemePreferences = (preferences) => {
    setThemePreferences(prev => ({ ...prev, ...preferences }));
  };

  const value = {
    // State
    currentContext,
    currentCompany,
    companies,
    expenses,
    income,
    budgets,
    loading,
    userProfile,
    notificationSettings,
    savingsGoals,
    themePreferences,

    // Categories
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,

    // Company management
    addCompany,
    removeCompany,
    renameCompany,
    switchContext,
    switchCompany,

    // Actions
    addExpense,
    addIncome,
    updateExpense,
    updateIncome,
    deleteExpense,
    deleteIncome,
    setBudget,
    toggleBookmark,
    updateUserProfile,
    updateNotificationSettings,
    updateThemePreferences,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavingsGoal,

    // Computed values
    getTotalExpenses,
    getTotalIncome,
    getExpensesByCategory,
    getIncomeByCategory,
    getNetBalance,
    getBudgetUtilization,
    getRecentTransactions,
    getTransactionHistory,
    getBookmarkedTransactions
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
