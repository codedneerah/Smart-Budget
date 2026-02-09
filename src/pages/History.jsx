import Topbar from "../components/Topbar.jsx";

const History = () => {
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  return (
    <>
      <Topbar pageTitle="History" />

      <div className="card">
        {history.length === 0 ? (
          <p>No activity recorded yet.</p>
        ) : (
          <ul>
            {history.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default History;
