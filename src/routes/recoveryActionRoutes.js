const express = require("express");
const router = express.Router();

const recoveryActionController = require("../controllers/recoveryActionController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const validate = require("../middlewares/validate");  
const { createRecoveryActionSchema, updateRecoveryActionSchema } = require("../validators/recoveryActionValidator");  

router.post("/", auth(), authorize("admin", "manager", "agent"), validate(createRecoveryActionSchema), recoveryActionController.createRecoveryAction);  
router.get("/", auth(), authorize("admin", "manager", "agent"), recoveryActionController.getRecoveryActions);  
router.get("/:id", auth(), authorize("admin", "manager", "agent"), recoveryActionController.getRecoveryActionById);  
router.put("/:id", auth(), authorize("admin", "manager"), validate(updateRecoveryActionSchema), recoveryActionController.updateRecoveryAction);  
router.delete("/:id", auth(), authorize("admin"), recoveryActionController.deleteRecoveryAction);  

module.exports = router;  