"use strict";

/**
 * Mengambil parameter pagination dari query string
 * @param {object} query - req.query
 * @returns {{ skip: number, take: number, page: nummber, limit: number}}
 */

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20))
    const skip = (page - 1) * limit;
    return {skip, take: limit, page, limit};
};

module.exports = {getPagination}