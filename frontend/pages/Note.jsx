import React, { useState, useEffect } from "react";
import Navbar from "../src/components/Navbar.jsx";
import NoteEditor from "../src/components/NoteEditor.jsx";
import { Plus, Search, Loader2, FileEdit, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notes/getnotes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch notes");
      setNotes(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (!token) return toast.error("User not authenticated");
    const confirmDelete = window.confirm("Delete this note?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/notes/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      fetchNotes();
    } catch (err) {
      toast.error(err.message || "Failed to delete note");
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Create, organize, and search your notes with AI assistance
            </p>
          </div>
          <button
            onClick={handleCreateNote}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm sm:text-base font-medium shadow-md transition-all hover:shadow-lg hover:scale-[1.03]"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-3/4 md:w-1/2 mb-10">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">
            {searchQuery
              ? "No notes found matching your search."
              : "No notes yet. Create your first note!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition transform hover:scale-[1.02] group flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-600">
                    {note.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all duration-300"
                      title="Edit note"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all duration-300"
                      title="Delete note"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                {note.summary && (
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                    {note.summary}
                  </p>
                )}

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {note.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {!note.summary && note.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {note.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor */}
      <NoteEditor
        note={selectedNote}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={fetchNotes}
        onUpdate={handleUpdateNote}
      />

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        Created by <span className="text-red-500">❤️</span>{" "}
        <a
          href="https://moteaditya.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline"
        >
          Aditya Mote
        </a>
      </footer>
    </div>
  );
}
