const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


router.post("/", auth(), authorize("admin", "manager"), invoiceController.createInvoice);
router.get("/", auth(), authorize("admin", "manager"), invoiceController.getInvoices);
router.get("/:id", auth(), authorize("admin", "manager"), invoiceController.getInvoiceById);
router.put("/:id", auth(), authorize("admin", "manager"), invoiceController.updateInvoice);
router.delete("/:id", auth(), authorize("admin"), invoiceController.deleteInvoice);

module.exports = router;