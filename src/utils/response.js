"use strict";

/** 
 * Respons sukses
 * @param {import('express').Response} res
 * @param {object} options
 */

const successResponse = (res, {statusCode = 200, message = "Berhasil", data = null, meta = null} = {}) => {
    const payload = {success: true, message};
    if (data !== null) payload.data = data;
    if (meta !== null) payload.meta = meta;
    return res.status(statusCode).json(payload);
};

/**
 * Respons error
 * @param {import{'express'}.Response} res
 * @param {object} options
 */

const errorResponse = (res, {statusCode= 500, message = "Terjadi kesalahan server", errors = null}= {}) => {
    const payload = { success: false, message};
    if (errors !== null) payload.errors = errors;
    return res.status(statusCode).json(payload)
};

/**
 * Respons pagination
 */

const paginationResponse = (res, {data, total, page, limit, message = "Berhasil"} = {}) => {
    return res.status(200).json({
        success: true,
        message,
        data,
        meta: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total/limit),
        },
    });
};

module.exports = { successResponse, errorResponse, paginationResponse};