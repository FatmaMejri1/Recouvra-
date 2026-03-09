const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator"); // <- updated path

// Register user
router.post("/register", validate(registerSchema), authController.register);

// Login user
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;