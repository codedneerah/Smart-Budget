export default function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="expense-item">
      <div>
        <h4>{expense.title}</h4>
        <small>{expense.category} • {expense.date}</small>
      </div>

      <div>
        <strong>₦{expense.amount}</strong>
        <button onClick={() => onDelete(expense.id)}>✕</button>
      </div>
    </div>
  );
}
