const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


router.post("/", auth(), authorize("admin", "manager", "agent"), paymentController.createPayment);

router.get("/", auth(), authorize("admin", "manager", "agent"), paymentController.getPayments);

router.get("/:id", auth(), authorize("admin", "manager", "agent"), paymentController.getPaymentById);


router.put("/:id", auth(), authorize("admin", "manager"), paymentController.updatePayment);
router.delete("/:id", auth(), authorize("admin"), paymentController.deletePayment);

module.exports = router;