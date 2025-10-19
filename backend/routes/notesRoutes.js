import express from "express";
import { createNote, getUserNotes, deleteNote, updateNote } from "../controllers/noteController.js";
import auth from "../middleware/Auth.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();    

router.post("/create", auth, createNote);
router.get("/getnotes", auth, getUserNotes);
router.delete("/delete/:id", auth, deleteNote);
router.put("/update/:id", auth, updateNote);
router.get("/analytics", auth, getAnalytics);

export default router;
