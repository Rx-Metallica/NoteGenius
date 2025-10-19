import express from 'express';
import aiChatWithNotes from '../utils/aiChatHelper.js';
import generateSummaryAndTags from '../utils/aiHelper.js';
import Auth from '../middleware/Auth.js';

const router = express.Router();
// router.post('/generate', generateAIContent);

router.post('/chat',Auth, async (req, res) => {
  const { userId, message } = req.body;
    try {
    const aiResponse = await aiChatWithNotes(userId, message);
    res.json({ response: aiResponse });
    } catch (error) {
    console.error("AI Chat Route error:", error);
    res.status(500).json({ error: "Failed to get AI response." });
    }
});

router.post('/generate', Auth, async (req, res) => {
    const { text } = req.body;
    try {
        const { summary, tags } = await generateSummaryAndTags(text);
        res.json({ summary, tags });
    } catch (error) {
        console.error("Generate Summary and Tags error:", error);
        res.status(500).json({ error: "Failed to generate summary and tags." });
    }

});

export default router;