const noteRoutes = require("./routes/note.route");
const internalAuth = require("./middleware/internal-auth.middleware");

app.use("/notes", internalAuth, noteRoutes);
