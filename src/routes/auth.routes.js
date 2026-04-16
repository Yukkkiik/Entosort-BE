const express = require('express');
const router = express.Router();
const { 
    login,
    logout,
    getProfile
 } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');

router.post("/login", login, validate(loginSchema) )
router.post("/logout", authenticate, logout)
router.get("/profile", authenticate, getProfile)
module.exports = router;