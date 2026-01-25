const axios = require("axios");
const authClient = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 2000,
});

const register = async data => {
  const response = await authClient.post("/auth/register", data);
  return response.data;
};
const login = async data => {
  const response = await authClient.post("/auth/login", data);
  return response.data;
};

const validateToken = async token => {
  const response = await authClient.post("/auth/validate", { token });
  return response.data;
};

module.exports = { validateToken, login, register };
