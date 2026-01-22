const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

/**
 * AUTH MIDDLEWARE
 * This runs BEFORE any route
 */

app.use(async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const authRes = await axios.post("http://localhost:4001/auth/validate", {
      token,
    });
    if (!authRes.data.valid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = authRes.data.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(503).json({ error: "Auth Service Unavailable" });
  }

  /**
   * ROUTE → NOTES SERVICE
   */

  app.post("/notes", async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:4002/notes",
        req.body,
        {
          headers: {
            "x-user-id": req.userId,
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      console.log(error.message);
      res.status(503).json({
        error: "Notes service unavailable",
      });
    }
  });
});

app.listen(4000, () => {
  console.log("API gateway running on port 4000");
});
