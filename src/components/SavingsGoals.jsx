import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const SavingsGoals = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addToSavingsGoal } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.targetAmount) {
      addSavingsGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        description: formData.description
      });
      setFormData({ name: '', targetAmount: '', description: '' });
      setShowForm(false);
    }
  };

  const handleAddAmount = (goalId) => {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(parseFloat(amount))) {
      addToSavingsGoal(goalId, parseFloat(amount));
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Savings Goals</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Goal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Amount ($)</label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minHeight: '80px'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Create Goal
            </button>
          </div>
        </form>
      )}

      {savingsGoals.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
          No savings goals yet. Create your first goal to start saving!
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {savingsGoals.map(goal => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div
                key={goal.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{goal.name}</h4>
                    {goal.description && (
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: progress >= 100 ? '#10b981' : 'var(--primary)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: remaining > 0 ? '#dc2626' : '#10b981' }}>
                    {remaining > 0 ? `$${remaining.toFixed(2)} remaining` : 'Goal achieved! 🎉'}
                  </span>
                  <button
                    onClick={() => handleAddAmount(goal.id)}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    + Add Money
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
