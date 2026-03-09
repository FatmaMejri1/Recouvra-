const Joi = require("joi");


const createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
    "any.required": "Email is required"
  }),
  phone: Joi.string().min(5).max(20).required().messages({
    "string.base": "Phone must be a string",
    "string.empty": "Phone is required",
    "string.min": "Phone must be at least 5 characters",
    "string.max": "Phone must be at most 20 characters",
    "any.required": "Phone is required"
  }),
  address: Joi.string().allow("").max(200).messages({
    "string.max": "Address must be at most 200 characters"
  }),
  company: Joi.string().allow("").max(100).messages({
    "string.max": "Company must be at most 100 characters"
  })
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters"
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be valid"
  }),
  phone: Joi.string().min(5).max(20).messages({
    "string.min": "Phone must be at least 5 characters",
    "string.max": "Phone must be at most 20 characters"
  }),
  address: Joi.string().allow("").max(200).messages({
    "string.max": "Address must be at most 200 characters"
  }),
  company: Joi.string().allow("").max(100).messages({
    "string.max": "Company must be at most 100 characters"
  })
}).min(1); 

module.exports = {
  createClientSchema,
  updateClientSchema
};