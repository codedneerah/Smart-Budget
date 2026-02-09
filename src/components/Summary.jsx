export default function Summary({ title, amount, color, icon }) {
  return (
    <div className="card summary" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>{title}</h3>
      </div>
      <h2 style={{
        margin: 0,
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: color
      }}>
        ${amount.toFixed(2)}
      </h2>
    </div>
  );
}
