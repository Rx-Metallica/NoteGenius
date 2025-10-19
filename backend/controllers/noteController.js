import Notes from "../models/Notes.js";
import generateSummaryAndTags from "../utils/aiHelper.js";

export const createNote = async (req, res) => {
  try {
    // 1. Get the user's input
    const { title, description } = req.body;

    // 2. Ensure authenticated user exists (middleware adds req.user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 3. Call AI helper for summary + tags
    const aiData = await generateSummaryAndTags(title, description);

    // 4. Create the new note with all required fields
    const newNote = new Notes({
      title,
      description,
      summary: aiData.summary,
      tags: aiData.tags,
      user: req.user.id, // ✅ link note to logged-in user
    });

    // 5. Save the note to MongoDB
    const savedNote = await newNote.save();

    // 6. Return the saved note
    res.status(201).json({
      message: "Note created successfully",
      note: savedNote,
    });

  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Failed to create note." });
  }
};

export const getUserNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Notes.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Notes.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note updated", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
