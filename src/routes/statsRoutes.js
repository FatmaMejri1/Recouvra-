const express = require("express");
const router = express.Router();

const statsController = require("../controllers/statsController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


router.get("/", auth(), authorize("admin", "manager"), statsController.getStats);

module.exports = router;