const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const validate = require("../middlewares/validate"); 
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");


router.post("/", auth(), authorize("admin"), validate(createUserSchema), userController.createUser);  
router.get("/", auth(), authorize("admin"), userController.getUsers);  
router.get("/:id", auth(), authorize("admin"), userController.getUserById);  
router.put("/:id", auth(), authorize("admin"), validate(updateUserSchema), userController.updateUser);  
router.delete("/:id", auth(), authorize("admin"), userController.deleteUser);  

module.exports = router;  