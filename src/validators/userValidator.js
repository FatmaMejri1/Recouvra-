const Joi = require("joi");


const createUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 50 characters",
      "any.required": "Name is required",
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),

  role: Joi.string()
    .valid("agent", "manager", "admin")
    .required()
    .messages({
      "any.only": "Role must be one of agent, manager, admin",
      "any.required": "Role is required",
    }),
});


const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      "string.base": "Name must be a string",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 50 characters",
    }),
  
  email: Joi.string()
    .email()
    .messages({
      "string.email": "Email must be a valid email",
    }),

  password: Joi.string()
    .min(6)
    .messages({
      "string.min": "Password must be at least 6 characters",
    }),

  role: Joi.string()
    .valid("agent", "manager", "admin")
    .messages({
      "any.only": "Role must be one of agent, manager, admin",
    }),
}).min(1); 
module.exports = {
  createUserSchema,
  updateUserSchema,
};