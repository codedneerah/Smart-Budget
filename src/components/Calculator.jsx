import { useState } from "react";

const Calculator = () => {
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");

  const rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.81,
    NGN: 790,
    CAD: 1.36,
  };

  // Safe evaluation function without using eval()
  const safeEvaluate = (expression) => {
    try {
      // Remove any non-numeric characters except operators and decimal points
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');

      // Use Function constructor as a safer alternative (though still not perfect)
      // In production, consider using a proper math expression parser
      const result = new Function('return ' + sanitized)();

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      return result;
    } catch (err) {
      throw new Error('Invalid expression');
    }
  };

  const calculate = (val) => {
    setError("");

    if (val === "C") {
      setValue("");
      return;
    }

    if (val === "=") {
      if (!value.trim()) {
        setError("Enter an expression");
        return;
      }

      try {
        let result = safeEvaluate(value);
        result = result * rates[currency];
        setValue(result.toFixed(2));
      } catch (err) {
        setError("Invalid calculation");
        setValue("");
      }
      return;
    }

    // Prevent multiple operators in sequence
    if (['+', '-', '*', '/'].includes(val) && ['+', '-', '*', '/'].includes(value.slice(-1))) {
      setValue(value.slice(0, -1) + val);
    } else {
      setValue(value + val);
    }
  };

  return (
    <div className="card">
      <h3>Quick Calculator</h3>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
        <label htmlFor="currency-select" style={{ fontWeight: "500" }}>Currency:</label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #cbd5f5" }}
        >
          {Object.keys(rates).map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>

      <input
        value={value}
        readOnly
        placeholder="0"
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1.2rem",
          textAlign: "right",
          marginBottom: "0.5rem",
          border: "1px solid #cbd5f5",
          borderRadius: "4px",
          backgroundColor: error ? "#fee2e2" : "#fff"
        }}
        aria-label="Calculator display"
      />

      {error && (
        <div style={{
          color: "#dc2626",
          fontSize: "0.875rem",
          marginBottom: "0.5rem",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <div className="calc-grid">
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","C","="].map(
          (btn) => (
            <button
              key={btn}
              onClick={() => calculate(btn)}
              style={{
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #cbd5f5",
                borderRadius: "4px",
                backgroundColor: btn === "=" ? "#10b981" : btn === "C" ? "#ef4444" : "#fff",
                color: (btn === "=" || btn === "C") ? "#fff" : "#000",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => {
                if (btn === "=") e.target.style.backgroundColor = "#059669";
                else if (btn === "C") e.target.style.backgroundColor = "#dc2626";
                else e.target.style.backgroundColor = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                if (btn === "=") e.target.style.backgroundColor = "#10b981";
                else if (btn === "C") e.target.style.backgroundColor = "#ef4444";
                else e.target.style.backgroundColor = "#fff";
              }}
              aria-label={btn === "C" ? "Clear" : btn === "=" ? "Calculate" : `Button ${btn}`}
            >
              {btn}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Calculator;
