import Topbar from "../components/Topbar";
import { useState } from "react";

const Expenses = () => {
  const [expenses, setExpenses] = useState(JSON.parse(localStorage.getItem("expenses") || "[]"));
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] = useState("");

  const addExpense = () => {
    if (!title || !amount) return;
    const newExp = { title, amount: Number(amount), purpose, budget: Number(budget), spent: Number(amount) };
    const updated = [...expenses, newExp];
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    setTitle(""); setAmount(""); setPurpose(""); setBudget("");
  };

  return (
    <>
      <Topbar pageTitle="Expenses" />
      <div style={{ marginLeft: "220px", padding: "2rem" }}>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <input placeholder="Item Name" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />
          <input placeholder="Budget" type="number" value={budget} onChange={e => setBudget(e.target.value)} />
          <button onClick={addExpense} style={{ background: "#38bdf8", color: "#fff" }}>Add</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#38bdf8", color: "#fff" }}>
                <th>Item Name</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center" }}>No expenses added</td></tr>}
              {expenses.map((exp, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #cbd5f5", textAlign: "center" }}>
                  <td>{exp.title}</td>
                  <td>${exp.amount}</td>
                  <td>{exp.purpose || "-"}</td>
                  <td>${exp.budget || 0}</td>
                  <td>${exp.spent}</td>
                  <td>${(exp.budget || exp.amount) - exp.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Expenses;
