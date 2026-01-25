const { validateToken } = require("../clients/auth.client");

const authMiddleware = async (req, res, next) => {
  const token = req.get("authorization");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const result = await validateToken(token);
    if (!result.valid) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = result.userId;
    next();
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Auth service timeout" });
    }
    return res.status(503).json({ error: "Auth service unavailable" });
  }
};

module.exports = authMiddleware;
