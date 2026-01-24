const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const validate = (req, res) => {
  const { token } = req.body;
  const result = authService.validateToken(token);
  res.json(result);
};

module.exports = {
  register,
  login,
  validate,
};
