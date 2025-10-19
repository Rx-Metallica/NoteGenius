import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const NoteEditor = ({ note, open, onClose, onSave, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.description || "");
      setSummary(note.summary || "");
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setSummary("");
      setTags([]);
    }
  }, [note]);

  const handleGenerateSummaryAndTags = async () => {
    if (!content.trim()) return toast.error("Please add content first");
    if (!token) return toast.error("User not authenticated");

    setAiLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: content.trim(), title: title.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "AI generation failed");

      setSummary(data.summary || "");
      setTags(data.tags || []);

      if (onUpdate && note?._id) {
        onUpdate({ ...note, summary: data.summary, tags: data.tags });
      }

      toast.success("AI summary and tags generated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error generating summary");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || title.length < 2)
      return toast.error("Title must be at least 2 characters");
    if (!token) return toast.error("User not authenticated");

    setLoading(true);
    try {
      const noteData = {
        title: title.trim(),
        description: content.trim(),
        summary: summary.trim() || null,
        tags: tags.length > 0 ? tags : [],
      };

      let url = `${BASE_URL}/api/notes/create`;
      let method = "POST";

      if (note?._id) {
        url = `${BASE_URL}/api/notes/update/${note._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save note");

      toast.success(data.message || "Note saved successfully");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4 relative shadow-xl">
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          {note?._id ? "Edit Note" : "Create Note"}
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Description</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition"
          />
        </div>

        {/* AI Button */}
        <button
          onClick={handleGenerateSummaryAndTags}
          disabled={aiLoading}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-white text-purple-700 border border-purple-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white transition disabled:opacity-50"
        >
          {aiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Generate Summary & Tags
        </button>

        {/* Summary */}
        {summary && (
          <div className="p-3 border border-gray-200 rounded bg-gray-50">
            <p className="text-gray-700 text-sm">{summary}</p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 flex items-center gap-1"
              >
                #{tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                />
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded bg-white text-purple-700 border border-purple-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded bg-white text-purple-700 border border-purple-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            ) : (
              "Save Note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
