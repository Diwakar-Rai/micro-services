const Note = require("../models/note.model");
const createNote = async (userId, text) => {
  return await Note.create({ userId, text });
};

const getNotesForUser = async userId => {
  return await Note.find({ userId }).sort({ createdAt: -1 });
};

module.exports = { createNote, getNotesForUser };
