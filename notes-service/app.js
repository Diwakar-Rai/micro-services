const express = require("express");
const app = express();
const axios = require("axios");
app.use(express.json());

const NOTES = [];
app.post("/notes", async (req, res) => {
  // const userId = req.get("x-user-id");
  const token = req.get("Authorization");
  // if (!userId) {
  //   return res.status(400).json({ error: "Missing user id" });
  // }

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  let authResponse;

  try {
    authResponse = await axios.post("http://localhost:4001/auth/validate", {
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      message: "Auth service unavailable",
    });
  }

  if (!authResponse.data.valid) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const note = {
    id: Date.now(),
    userId: authResponse.data.userId,
    text: req.body.text,
  };

  NOTES.push(note);

  res.json(note);
});

app.listen(4002, () => {
  console.log("Notes service running on port 4001");
});
