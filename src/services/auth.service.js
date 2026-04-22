const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/hashPassword');

const login = async (username, password) => {
    if (!username || !password) {
        throw {
            status: 400,
            message: 'Username and password are required'
        }
    }
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (!user) throw {
        status:401,
        message: 'Invalid username or password'
    };

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) throw {
        status: 401,
        message: 'Invalid Username or Password'
    };

    const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        }
    }
};

const getProfile = async(id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            username: true,
            role: true,
            created_at: true
        },
    });
    if(!user) throw {
        status: 404,
        message: "User tidak ditemukan"
    };
    return user
}

module.exports = {
    login,
    getProfile
}