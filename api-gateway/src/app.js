const express = require("express");
const authMiddleware = require("./middleware/auth.middleware");
const { createNote } = require("./clients/notes.client");

const app = express();

app.use(express.json());

app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const note = await createNote(req.body, {
      "x-user-id": req.userId,
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
    });
    res.json(note);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Notes service timeout" });
    }

    res.status(503).json({ error: "Notes service unavailable" });
  }
});

module.exports = app;
