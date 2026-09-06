const { analyzeEmail } = require("../services/analysis.service");

const analyzeEmailController = async (req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error(
                "Authentication required."
            );

            error.statusCode = 401;

            throw error;
        }

        if (!req.user.accessToken) {
            const error = new Error(
                "Google access token is missing."
            );

            error.statusCode = 401;

            throw error;
        }

        const { id } = req.params;

        if (!id || id.trim() === "") {
            const error = new Error(
                "Email ID is required."
            );

            error.statusCode = 400;

            throw error;
        }

        const result = await analyzeEmail(
            req.user.accessToken,
            id,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Email analyzed successfully.",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeEmailController,
};