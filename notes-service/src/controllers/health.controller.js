const healthCheck = (req, res) => {
  res.json({
    service: "notes-service",
    status: "UP",
  });
};

module.exports = { healthCheck };
