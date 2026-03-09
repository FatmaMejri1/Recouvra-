const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};


const createRecoveryActionSchema = Joi.object({
  invoiceId: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "Invoice ID is required",
    "any.required": "Invoice ID is required"
  }),
  performedBy: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "PerformedBy ID is required",
    "any.required": "PerformedBy ID is required"
  }),
  action: Joi.string().valid("call client", "send email", "visit client", "other").required().messages({
    "any.only": "Action must be one of: call client, send email, visit client, other",
    "any.required": "Action is required"
  }),
  date: Joi.date().iso().optional().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format"
  })
});

const updateRecoveryActionSchema = Joi.object({
  invoiceId: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "Invoice ID cannot be empty"
  }),
  performedBy: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "PerformedBy ID cannot be empty"
  }),
  action: Joi.string().valid("call client", "send email", "visit client", "other").messages({
    "any.only": "Action must be one of: call client, send email, visit client, other"
  }),
  date: Joi.date().iso().messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format"
  })
}).min(1); 

module.exports = {
  createRecoveryActionSchema,
  updateRecoveryActionSchema
};