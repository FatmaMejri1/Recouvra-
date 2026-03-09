const Joi = require("joi");
const mongoose = require("mongoose");


const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};


const createPaymentSchema = Joi.object({
  invoice: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "Invoice ID is required",
    "any.required": "Invoice ID is required"
  }),
  client: Joi.string().custom(objectIdValidator).optional().messages({
    "string.empty": "Client ID cannot be empty"
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required"
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format",
    "any.required": "Date is required"
  }),
  method: Joi.string().max(50).optional().messages({
    "string.max": "Method must be at most 50 characters"
  })
});

const updatePaymentSchema = Joi.object({
  invoice: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "Invoice ID cannot be empty"
  }),
  client: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "Client ID cannot be empty"
  }),
  amount: Joi.number().positive().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive"
  }),
  date: Joi.date().iso().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format"
  }),
  method: Joi.string().max(50).messages({
    "string.max": "Method must be at most 50 characters"
  })
}).min(1); 

module.exports = {
  createPaymentSchema,
  updatePaymentSchema
};