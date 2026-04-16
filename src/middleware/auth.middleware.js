const { verifyToken } = require('../utils/jwt')
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ditemukan",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid atau sudah kadaluwarsa"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }

        req.user = user;
        next();
    } catch( error ) {
        console.log("error pada middleware atuhenticate:", error)
    }
};

const authorizeAdmin = (req, res, next) => {
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