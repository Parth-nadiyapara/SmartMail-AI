const sendResponse = require("../utils/response");

const { getAuthenticatedUser } = require("../services/auth.service");

const FRONTEND_URL =
    process.env.FRONTEND_URL || "http://localhost:5173";

const googleCallback = (req, res) => {
    res.redirect(`${FRONTEND_URL}/auth/callback`);
};

const getMe = (req, res) => {
    if (!req.user) {
        return sendResponse(
            res,
            401,
            false,
            "Not authenticated."
        );
    }

    const user = getAuthenticatedUser(req.user);

    return sendResponse(
        res,
        200,
        true,
        "Authenticated user fetched.",
        user
    );
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((destroyErr) => {
            if (destroyErr) return next(destroyErr);

            res.clearCookie("connect.sid");

            return sendResponse(
                res,
                200,
                true,
                "Logged out successfully."
            );
        });
    });
};

module.exports = {
    googleCallback,
    getMe,
    logout,
};