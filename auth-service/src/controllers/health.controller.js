const healthCheck = (req, res) => {
  res.json({
    service: "auth-service",
    status: "UP",
  });
};

module.exports = { healthCheck };
