const express = require("express");
const app = express();
app.use(express.json());

// const NOTES = [];
app.post("/notes", async (req, res) => {
  const userId = req.get("x-user-id");
  if (!userId) {
    return res.status(400).json({ error: "Missing user id" });
  }
  const note = {
    id: Date.now(),
    userId,
    text: req.body.text,
  };

  // NOTES.push(note);

  res.json(note);
});

app.listen(4002, () => {
  console.log("Notes service running on port 4002");
});
