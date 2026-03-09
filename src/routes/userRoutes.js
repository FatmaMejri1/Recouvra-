const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.post("/", auth(), authorize("admin"), userController.createUser);
router.get("/", auth(), authorize("admin"), userController.getUsers);
router.get("/:id", auth(), authorize("admin"), userController.getUserById);
router.put("/:id", auth(), authorize("admin"), userController.updateUser);
router.delete("/:id", auth(), authorize("admin"), userController.deleteUser);

module.exports = router;