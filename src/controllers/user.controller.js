const userService = require('../services/user.service');
const { successResponse, paginationResponse } = require('../utils/response');

const getAllUsers = async(req, res, next) => {
    try {
        const { users, total, page, limit } = await userService.getAllUsers(req.query);
        return paginationResponse (res, {
            data: users,
            total,
            page,
            limit,
            message: "Daftar Pengguna berhasil diambil"
        })
    } catch (error) {
        next(error)
    }
};

const getUserById = async(req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);
        return successResponse(res, {
            message: "Detail pengguna berhasil diambil",
            data: user
        })
    } catch (error){
        next(error)
    }
};

const createUser = async(req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        return successResponse(res, {
            statusCode: 201,
            message: "User berhasil dibuat",
            data: user
        })
    } catch (error) {
        next(error)
    }
};

const updateUser = async(req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        return successResponse(res, {
            statusCode: 201,
            message: "User berhasil diubah",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res, next) => {
    try {
        const user = await userService.deleteUser(parseInt(req.params.id), req.user.id);
        return successResponse(res, {
            statusCode: 201,
            message: "User berhasil dihapus",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}