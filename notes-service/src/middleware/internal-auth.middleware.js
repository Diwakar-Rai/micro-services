const internalAuth = (req, res, next) => {
  const secret = req.get("x-internal-secret");

  if (secret !== process.env.INTERNAL_SERVICE_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

module.exports = internalAuth;
