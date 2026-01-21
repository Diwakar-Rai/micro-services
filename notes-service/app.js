const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({
    service: "Notes",
    status: "UP",
  });
});

app.listen(4001, () => {
  console.log("Notes service running on port 4001");
});
