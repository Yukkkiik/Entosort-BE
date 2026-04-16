"use strict";
 
const Joi = require("joi");
 
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Format email tidak valid.",
    "any.required": "Email wajib diisi.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal 6 karakter.",
    "any.required": "Password wajib diisi.",
  }),
});

module.exports = { loginSchema }