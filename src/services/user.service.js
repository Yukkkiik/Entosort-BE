const prisma = require('../config/database');
const { hashPassword } = require('../utils/hashPassword');
const { getPagination } = require('../utils/pagination');

const getAllUsers = async(query) => {
    const { skip, take, page, limit } = getPagination(query);
    const { search, role } = query;

    const where = {
        ...(role && { role }),
        ...(search && {
            OR: [
                { username: { contains: search, mode: "insensitive"}},
            ],
        }),
    };

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({ where, skip, take,  
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        }),
        prisma.user.count({ where })
    ]);
    return { users, total, page, limit};
};

const getUserById = async(id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            username: true,
            role: true,
            phone: true,
            createdAt: true,
            updatedAt: true
        },
    });
    if(!user) throw {
        status: 404,
        message: "user not found",
    };
    return user;
};

const createUser = async({username, password, phone, role}) => {
    const exists = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (exists) throw {
        status: 400,
        message: 'Username sudah digunakan',
    };

    const hashedPassword = await hashPassword(password);

    return prisma.user.create({
        data: {
            username, 
            password: hashedPassword,
            phone,
            role: role || "OPERATOR"
        },
        select: {
            id: true,
            username: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true
        },
    });
};

const updateUser = async(id,{username, password,phone, role}) =>{
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (password) updateData.password = await hashPassword(password);
    if (phone) updateData.phone = phone
    try {
        return await prisma.user.update({
            where: {
                id
            },
            data: updateData,
            select: {
                id: true,
                username: true,
                phone: true,
                role: true,
                createdAt: true
            },
        });
    } catch(error) {
        if (error.code === "P2025") throw { status: 404, message: "User tidak ditemukan"}
        throw error
    }
}

const deleteUser = async(id, requesterId) => {
    if (id === requesterId) throw {
        status: 400,
        message: "Tidak dapat menghapus akun sendiri"
    };

    try {
        await prisma.user.delete({
            where: {
                id
            }
        });
    } catch (error) {
        if (error.code === "P2025") throw {
            status: 404,
            message: "User tidak ditemukan"
        }
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}