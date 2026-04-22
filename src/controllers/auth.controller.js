const authService = require('../services/auth.service')
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
    try {   
        const result = await authService.login(req.body.username, req.body.password);
        res.cookie('access_token', result.token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 100 // 1 jam
        })
        return successResponse(res, {
            message: "login successful",
        })
    } catch (error) {
        next(error);
    }
};

const logout = async(_req, res) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return successResponse(res, {
            message: "Logout Successful"
        })
    } catch (error) {
        next(error);
    }
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