import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";

const NotesPage = () => {
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
    <>
      <Topbar pageTitle="Notes / Journal" />
      <div className="card" style={{ padding: "1.5rem", borderRadius: "12px", maxWidth: "700px", margin: "2rem auto" }}>
        <textarea
          placeholder="Write your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem", border: "1px solid #cbd5f5", resize: "none" }}
        />
        <button
          onClick={addNote}
          style={{ background: "#38bdf8", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          Add Note
        </button>

        <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
          {notes.map((note, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#f1f5f9",
                padding: "0.7rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{note.date}:</strong> {note.text}
              </div>
              <button
                onClick={() => deleteNote(idx)}
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NotesPage;
