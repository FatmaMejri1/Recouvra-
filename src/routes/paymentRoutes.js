const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


const validate = require("../middlewares/validate");  
const { createPaymentSchema, updatePaymentSchema } = require("../validators/paymentValidator");  

router.post("/", auth(), authorize("admin", "manager", "agent"), validate(createPaymentSchema), paymentController.createPayment);  
router.get("/", auth(), authorize("admin", "manager", "agent"), paymentController.getPayments);  
router.get("/:id", auth(), authorize("admin", "manager", "agent"), paymentController.getPaymentById);  
router.put("/:id", auth(), authorize("admin", "manager"), validate(updatePaymentSchema), paymentController.updatePayment);  
router.delete("/:id", auth(), authorize("admin"), paymentController.deletePayment);  

module.exports = router; 