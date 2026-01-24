require("dotenv").config();
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
function log(req, message) {
  console.log(
    `[${new Date().toISOString()}]`,
    `[requestId=${req.requestId}]`,
    message,
  );
}

app.use((req, res, next) => {
  const requestId = req.get("x-request-id") || crypto.randomUUID();
  req.requestId = requestId;
  res.set("x-request-id", requestId);
  next();
});

app.use(express.json());

const authClient = axios.create({
  baseURL: "http://localhost:4001",
  timeout: 2000,
});
const notesClient = axios.create({
  baseURL: "http://localhost:4002",
  timeout: 2000,
});

const circuitBreaker = {
  failures: 0,
  state: "CLOSED",
  lastFailureTime: null,
};

const FAILURE_THRESHOLD = 3;
const RESET_TIMEOUT = 10000;

async function callAuthService(token) {
  const now = Date.now();

  if (circuitBreaker.state === "OPEN") {
    if (now - circuitBreaker.lastFailureTime > RESET_TIMEOUT) {
      circuitBreaker.state = "HALF_OPEN";
    } else {
      throw new Error("CIRCUIT_OPEN");
    }
  }

  try {
    const res = await authClient.post("/auth/validate", { token });
    circuitBreaker.failures = 0;
    circuitBreaker.state = "CLOSED";
    return res.data;
  } catch (error) {
    circuitBreaker.failures++;
    if (circuitBreaker.failures >= FAILURE_THRESHOLD) {
      circuitBreaker.state = "OPEN";
      circuitBreaker.lastFailureTime = Date.now();
    }
    throw error;
  }
}
/**
 * AUTH MIDDLEWARE
 * This runs BEFORE any route
 */

app.use(async (req, res, next) => {
  log(req, "authenticating the user");

  const token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const authResult = await callAuthService(token);
    if (!authResult.valid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = authResult.userId;
    next();
  } catch (error) {
    if (error.message === "CIRCUIT_OPEN") {
      return res.status(503).json({
        error: "Auth service temporarily unavailable",
      });
    }
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
          "x-request-id": req.requestId,
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
