const noteService = require("../services/note.service");
const createNote = async (req, res) => {
  try {
    const userId = req.get("x-user-id");
    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({
        error: "Note text is required",
      });
    }

    const note = await noteService.createNote(userId, req.body.text);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = req.get("x-user-id");
    const notes = await noteService.getNotesForUser(userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

module.exports = { createNote, getNotes };
