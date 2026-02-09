import { useState } from "react";
import { useFinance, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../context/FinanceContext";

const ExpenseForm = ({ type = "expense" }) => {
  const { addExpense, addIncome, EXPENSE_CATEGORIES, INCOME_CATEGORIES } = useFinance();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
    description: "",
    date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const transactionData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date
      };

      if (type === "expense") {
        addExpense(transactionData);
      } else {
        addIncome(transactionData);
      }

      // Reset form
      setFormData({
        title: "",
        amount: "",
        category: type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding transaction:", error);
      setErrors({ submit: "Failed to add transaction. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form className="expense-form" onSubmit={submitHandler} style={{ maxWidth: "500px" }}>
      <h3 style={{ marginBottom: "1rem", color: type === "expense" ? "#dc2626" : "#10b981" }}>
        Add {type === "expense" ? "Expense" : "Income"}
      </h3>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder={`${type === "expense" ? "Expense" : "Income"} title`}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${errors.title ? "#dc2626" : "#cbd5f5"}`,
            borderRadius: "8px",
            fontSize: "1rem",
            marginBottom: "0.25rem"
          }}
          aria-label={`${type} title`}
          aria-invalid={!!errors.title}
        />
        {errors.title && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.title}</span>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${errors.amount ? "#dc2626" : "#cbd5f5"}`,
            borderRadius: "8px",
            fontSize: "1rem",
            marginBottom: "0.25rem"
          }}
          aria-label="Amount"
          aria-invalid={!!errors.amount}
        />
        {errors.amount && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.amount}</span>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${errors.category ? "#dc2626" : "#cbd5f5"}`,
            borderRadius: "8px",
            fontSize: "1rem",
            marginBottom: "0.25rem"
          }}
          aria-label="Category"
          aria-invalid={!!errors.category}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.category}</span>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #cbd5f5",
            borderRadius: "8px",
            fontSize: "1rem"
          }}
          aria-label="Date"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #cbd5f5",
            borderRadius: "8px",
            fontSize: "1rem",
            resize: "vertical"
          }}
          aria-label="Description"
        />
      </div>

      {errors.submit && (
        <div style={{
          color: "#dc2626",
          fontSize: "0.875rem",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: type === "expense" ? "#dc2626" : "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "opacity 0.2s"
        }}
      >
        {isSubmitting ? "Adding..." : `Add ${type === "expense" ? "Expense" : "Income"}`}
      </button>
    </form>
  );
};

export default ExpenseForm;
