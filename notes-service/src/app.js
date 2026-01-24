const express = require("express");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/health.routes");

const app = express();
app.use(express.json());

connectDB();

app.use("/health", healthRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Notes services running on port ${PORT}`);
});
