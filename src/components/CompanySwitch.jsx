import { useState, useEffect } from "react";

const CompanySwitch = () => {
  const [company, setCompany] = useState(
    localStorage.getItem("company") || "Company A"
  );

  useEffect(() => {
    localStorage.setItem("company", company);
  }, [company]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ marginRight: "0.5rem", fontWeight: "bold", color: "#333" }}>
        Company:
      </label>
      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid #cbd5f5",
          background: "#f8f9fa",
          color: "#111",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        <option value="Company A">Company A</option>
        <option value="Company B">Company B</option>
        <option value="Company C">Company C</option>
      </select>
    </div>
  );
};

export default CompanySwitch;
