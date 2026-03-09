const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.post("/", auth(), authorize("admin", "manager"), clientController.createClient);

router.get("/", auth(), authorize("admin", "manager"), clientController.getClients);

router.get("/:id", auth(), authorize("admin", "manager"), clientController.getClientById);

router.put("/:id", auth(), authorize("admin", "manager"), clientController.updateClient);

router.delete("/:id", auth(), authorize("admin"), clientController.deleteClient);

module.exports = router;