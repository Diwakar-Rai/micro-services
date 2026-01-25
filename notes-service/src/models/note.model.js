const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    text: { types: String, required: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Note", noteSchema);
