const {
    getAnalysisHistory,
    getAnalysisByMessageId,
} = require("../services/analysis-history.service");


const getHistory = async (
    req,
    res,
    next
) => {

    try {

        if (!req.user) {

            const error = new Error(
                "Authentication required."
            );

            error.statusCode = 401;

            throw error;
        }


        const history =
            await getAnalysisHistory(
                req.user.databaseId
            );


        return res.status(200).json({

            success: true,

            message:
                "Analysis history fetched successfully.",

            data: history,

        });

    } catch (error) {

        next(error);

    }
};


const getHistoryByMessageId = async (
    req,
    res,
    next
) => {

    try {

        if (!req.user) {

            const error = new Error(
                "Authentication required."
            );

            error.statusCode = 401;

            throw error;
        }


        const { id } = req.params;


        if (!id) {

            const error = new Error(
                "Email ID is required."
            );

            error.statusCode = 400;

            throw error;
        }


        const analysis =
            await getAnalysisByMessageId(
                req.user.databaseId,
                id
            );


        if (!analysis) {

            const error = new Error(
                "Analysis not found."
            );

            error.statusCode = 404;

            throw error;
        }


        return res.status(200).json({

            success: true,

            message:
                "Analysis fetched successfully.",

            data: analysis,

        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getHistory,
    getHistoryByMessageId,
};