"use strict";

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak request dari IP ini. coba lagi setelah 15 menit",
    },
    skip: (req) => {
        return req.path.startsWith("/sensor") || req.path.startsWith("/harvest");
    },
});

module.exports = rateLimiter