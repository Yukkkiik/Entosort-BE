const { verifyToken } = require('../utils/jwt')
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        let token = null;

        if(req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token;
        }

        if(!token) {
            const authHeader = req.headers.authorization;

            if(authHeader && authHeader.startWith('Bearer')) {
                token = authHeader.split(' ')[1];
            }
        }

        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                username: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch( error ) {
        console.error('Error pada middleware authenticate:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token sudah kadaluwarsa, silakan login ulang'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak. Hanya Admin yang diizinkan."
        })
    }
    next();
};

module.exports = {
   authorizeAdmin, 
   authenticate
}