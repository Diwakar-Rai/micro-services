const express = require("express");
const router = express.Router();
const healthController = rquire("../controllers/health.controller");
router.get("/", healthController.healthCheck);

module.exports = router;
