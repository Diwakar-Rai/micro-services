const axios = require("axios");
const notesClient = axios.create({
  baseURL: process.env.NOTES_SERVICE_URL,
  timeout: 2000,
});

const createNote = async (data, headers) => {
  const response = await notesClient.post("/notes", data, { headers });
  return response.data;
};

const getNotes = async headers => {
  const response = await notesClient.get("/notes", { headers });
  return response.data;
};
module.exports = { createNote, getNotes };
