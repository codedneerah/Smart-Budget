import { useState, useEffect } from "react";

const Notes = () => {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes") || "[]"));
  const [text, setText] = useState("");

  const addNote = () => {
    if (!text) return;
    const newNotes = [...notes, { text, date: new Date().toLocaleString() }];
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setText("");
  };

  const deleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  return (
    <div className="card" style={{ padding: "1rem", borderRadius: "12px" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Notes / Journal</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your note here..."
        style={{
          width: "100%",
          height: "80px",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #cbd5f5",
          resize: "none",
          marginBottom: "0.5rem",
        }}
      />
      <button
        onClick={addNote}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          background: "#38bdf8",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Add Note
      </button>

      <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
        {notes.map((note, idx) => (
          <li
            key={idx}
            style={{
              background: "#f1f5f9",
              padding: "0.5rem",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{note.date}:</strong> {note.text}
            </div>
            <button
              onClick={() => deleteNote(idx)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
