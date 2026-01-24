require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.requestId = req.get("x-request-id");
  next();
});

function log(req, message) {
  console.log(`[notes-service]`, `[requestId=${req.requestId}]`, message);
}
// const NOTES = [];
app.post("/notes", async (req, res) => {
  log(req, "creating note");

  const userId = req.get("x-user-id");
  const secret = req.get("x-internal-secret");

  if (secret !== process.env.SUPER_SECRET) {
    return res.status(403).json({
      error: "Forbidden service",
    });
  }
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
