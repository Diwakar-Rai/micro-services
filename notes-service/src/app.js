const express = require("express");
const noteRoutes = require("./routes/note.route");
const internalAuth = require("./middleware/internal-auth.middleware");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4002;
const app = express();
connectDB();
app.use(express.json());

app.use("/notes", internalAuth, noteRoutes);

app.listen(PORT, () => {
  console.log(`Notes App running on Port ${PORT}`);
});

module.exports = app;
