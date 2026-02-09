import { useFinance } from "../context/FinanceContext";

const CurrencySelector = () => {
  const { currency, currencyRates, setCurrency } = useFinance();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'var(--card)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      fontSize: '0.875rem'
    }}>
      <span style={{ color: 'var(--text)', fontWeight: '500' }}>Currency:</span>
      <select
        value={currency}
        onChange={handleCurrencyChange}
        style={{
          padding: '0.25rem 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
      >
        {Object.entries(currencyRates).map(([code, rate]) => (
          <option key={code} value={code}>
            {code} ({rate.toFixed(2)})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
