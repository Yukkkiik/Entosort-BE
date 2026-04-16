const authService = require('../services/auth.service')

const login = async (req, res, next) => {
    try {   
        const result = await authService.login(req.body.username, req.body.password);
        res.status(200).json({
            success: true,
            message: 'login successful ',
            data: result
        })
    } catch (error) {
        next(error);
    }
};

const logout = async(_req, res) => {
    res.json({
        success: true,
        message: "Logout berhasil"
    });
};

const getProfile = async(req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    logout,
    getProfile
}