import { useState, useEffect } from "react";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history") || "[]")
  );

  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );

  // Save expenses in localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addExpense = (title, amount) => {
    const newExp = { title, amount };
    setExpenses([...expenses, newExp]);
    setHistory([...history, `Added: ${title} ($${amount})`]);
  };

  const bookmarkExpense = (title) => {
    if (!bookmarks.includes(title)) {
      setBookmarks([...bookmarks, title]);
    }
  };

  return (
    <div>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expenses.map((exp, index) => (
            <li key={index}>
              {exp.title} - ${exp.amount}{" "}
              <button onClick={() => bookmarkExpense(exp.title)}>
                Bookmark
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
