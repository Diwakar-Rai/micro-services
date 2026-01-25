const express = require("express");
const router = express.Router();

const authClient = require("../clients/auth.client");

router.post("/register", async (req, res) => {
  try {
    const result = await authClient.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await authClient.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
