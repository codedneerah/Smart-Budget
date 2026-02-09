// Input validation utilities
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && num <= 999999999;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const sanitizeInput = (input) => {
  return input.toString().trim().replace(/[<>]/g, '');
};

// Form validation
export const validateExpenseForm = (data) => {
  const errors = {};

  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }

  if (!validateAmount(data.amount)) {
    errors.amount = 'Please enter a valid amount (0-999,999,999)';
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateIncomeForm = (data) => {
  const errors = {};

  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }

  if (!validateAmount(data.amount)) {
    errors.amount = 'Please enter a valid amount (0-999,999,999)';
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
