require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const authClient = axios.create({
  baseURL: "http://localhost:4001",
  timeout: 2000,
});
const notesClient = axios.create({
  baseURL: "http://localhost:4002",
  timeout: 2000,
});

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
    const authRes = await authClient.post("/auth/validate", {
      token,
    });
    if (!authRes.data.valid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = authRes.data.userId;
    next();
  } catch (error) {
    if (error.code == "ECONNABORTED") {
      return res.status(504).json({ error: "Auth service timeout" });
    }
    return res.status(503).json({ error: "Auth Service Unavailable" });
  }

  /**
   * ROUTE → NOTES SERVICE
   */

  app.post("/notes", async (req, res) => {
    try {
      const response = await notesClient.post("/notes", req.body, {
        headers: {
          "x-user-id": req.userId,
          "x-internal-secret": process.env.SUPER_SECRET,
        },
      });

      return res.json(response.data);
    } catch (error) {
      if (error.code == "ECONNABORTED") {
        return res.status(504).json({ error: "Notes service timeout" });
      }
      console.log(error.code);
      return res.status(503).json({
        error: "Notes service unavailable",
      });
    }
  });
});

app.listen(4000, () => {
  console.log("API gateway running on port 4000");
});
