import React from "react";
import { Trash2, Edit } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

const NoteCard = ({ note, token, onEdit, onDelete }) => {
  // Delete confirmation triggers parent callback
  const handleDelete = () => {
    if (!token) {
      alert("User not authenticated!");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) onDelete(note._id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col justify-between">
      {/* Title & Actions */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <Edit className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
          </button>
        </div>
      </div>

      {/* Summary / Description */}
      <div className="text-gray-700 text-sm mb-3">
        {note.summary ? (
          <>
            <p className="font-medium text-gray-900 mb-1">Summary:</p>
            <p>{note.summary}</p>
          </>
        ) : (
          note.description || "No description available"
        )}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Updated At
      <p className="text-xs text-gray-400 mt-auto">
        Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
      </p> */}
    </div>
  );
};

export default NoteCard;
