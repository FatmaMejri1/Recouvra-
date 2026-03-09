const Joi = require("joi");

// Registration validation
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required"
  }),
  role: Joi.string().valid("agent", "manager", "admin").optional() // Only admin can use this in controller
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});

module.exports = { registerSchema, loginSchema };