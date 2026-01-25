const express = require("express");
const authMiddleware = require("./middleware/auth.middleware");
const { createNote, getNotes } = require("./clients/notes.client");
const authRouter = require("./routes/auth.route");

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const note = await createNote(req.body, {
      "x-user-id": req.userId,
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
    });
    return res.json(note);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Notes service timeout" });
    }

    return res.status(503).json({ error: "Notes service unavailable" });
  }
});

app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await getNotes({
      "x-user-id": req.userId,
      "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET,
    });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(503).json({ error: "Notes service unavailable" });
  }
});

module.exports = app;
