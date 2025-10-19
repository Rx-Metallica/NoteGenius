import Notes from "../models/Notes.js";

/**
 * GET /api/analytics
 * @desc Get analytics for a user — total notes, unique tags, recent note, and top tags
 * @access Private
 */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all notes for the logged-in user
    const notes = await Notes.find({ user: userId });

    // Total number of notes
    const totalNotes = notes.length;

    // Extract all tags into a single array
    const allTags = notes.flatMap(note => note.tags || []);

    // Unique tags
    const uniqueTags = [...new Set(allTags)];

    // Count frequency of tags
    const tagFrequency = {};
    allTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    // Sort tags by frequency (top tags)
    const topTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Most recent note (sorted by creation date)
    const recentNote = notes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    res.status(200).json({
      success: true,
      data: {
        totalNotes,
        uniqueTagsCount: uniqueTags.length,
        topTags,
        recentNote: recentNote
          ? {
              title: recentNote.title,
              summary: recentNote.summary,
              createdAt: recentNote.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
