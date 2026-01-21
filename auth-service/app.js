const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({
    service: "Auth",
    status: "UP",
  });
});

app.listen(4001, () => {
  console.log("Auth service running on port 4001");
});
