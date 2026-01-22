const express = require("express");
const app = express();

app.use(express.json());
app.post("/auth/validate", (req, res) => {
  const { token } = req.body;
  if (token === "valid-token") {
    return res.json({
      valid: true,
      userId: "user-123",
    });
  }
  return res.json({ valid: false });
});

app.listen(4001, () => {
  console.log("Auth service running on port 4001");
});
