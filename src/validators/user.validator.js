"use strict";
 
const Joi = require("joi");
 
// Admin: update data user manapun (full access)
const adminUpdateUserSchema = Joi.object({
  username: Joi.string().min(2).max(100).trim().optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{8,20}$/)
    .optional()
    .allow("", null),
  role: Joi.string().valid("ADMIN", "USER").optional(),
  password: Joi.string().min(6).max(128).optional(),
}).min(1).messages({ "object.min": "Minimal satu field harus diubah." });
 
// User biasa: hanya boleh ubah phone, profilePhoto (via file upload), dan password
const userSelfUpdateSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{8,20}$/)
    .optional()
    .allow("", null)
    .messages({ "string.pattern.base": "Format nomor HP tidak valid." }),
  password: Joi.string().min(6).max(128).optional(),
  currentPassword: Joi.string().when("password", {
    is: Joi.exist(),
    then: Joi.required().messages({
      "any.required": "Password lama wajib diisi saat mengganti password.",
    }),
    otherwise: Joi.optional(),
  }),
}).min(1).messages({ "object.min": "Minimal satu field harus diubah." });
 
module.exports = { adminUpdateUserSchema, userSelfUpdateSchema };