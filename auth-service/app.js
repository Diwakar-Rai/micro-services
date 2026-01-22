const express = require("express");
const app = express();

app.use(express.json());
app.post("/auth/validate", async (req, res) => {
  // To check the latency of the service
  // await new Promise(resolve => setTimeout(resolve, 5000));

  const { token } = req.body;
  if (token === "valid-token") {
    return res.json({
      valid: true,
      userId: "admin-123",
    });
  }
  return res.json({ valid: false });
});

app.listen(4001, () => {
  console.log("Auth service running on port 4001");
});
