const Joi = require("joi");
const mongoose = require("mongoose");


const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};


const createInvoiceSchema = Joi.object({
  client: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "Client ID is required",
    "any.required": "Client ID is required"
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required"
  }),
  dueDate: Joi.date().iso().required().messages({
    "date.base": "Due date must be a valid date",
    "date.format": "Due date must be in ISO format",
    "any.required": "Due date is required"
  }),
  status: Joi.string().valid("pending", "paid").messages({
    "any.only": "Status must be either 'pending' or 'paid'"
  })
});


const updateInvoiceSchema = Joi.object({
  client: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "Client ID cannot be empty"
  }),
  amount: Joi.number().positive().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive"
  }),
  dueDate: Joi.date().iso().messages({
    "date.base": "Due date must be a valid date",
    "date.format": "Due date must be in ISO format"
  }),
  status: Joi.string().valid("pending", "paid").messages({
    "any.only": "Status must be either 'pending' or 'paid'"
  })
}).min(1); 

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema
};