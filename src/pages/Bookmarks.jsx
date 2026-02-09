import Topbar from "../components/Topbar.jsx";

const Bookmarks = () => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  return (
    <>
      <Topbar pageTitle="Bookmarks" />

      <div className="card">
        {bookmarks.length === 0 ? (
          <p>No bookmarked items yet.</p>
        ) : (
          <ul>
            {bookmarks.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Bookmarks;
