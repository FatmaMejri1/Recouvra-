const express = require("express");
const router = express.Router();

const recoveryActionController = require("../controllers/recoveryActionController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.post("/", auth(), authorize("admin", "manager", "agent"), recoveryActionController.createRecoveryAction);


router.get("/", auth(), authorize("admin", "manager", "agent"), recoveryActionController.getRecoveryActions);

router.get("/:id", auth(), authorize("admin", "manager", "agent"), recoveryActionController.getRecoveryActionById);


router.put("/:id", auth(), authorize("admin", "manager"), recoveryActionController.updateRecoveryAction);


router.delete("/:id", auth(), authorize("admin"), recoveryActionController.deleteRecoveryAction);

module.exports = router;