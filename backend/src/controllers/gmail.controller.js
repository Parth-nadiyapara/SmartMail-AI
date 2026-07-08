const sendResponse = require("../utils/response");

const {
    getInboxEmails
} = require("../services/gmail.service");

const getEmails = async (req, res, next) => {
    try {

        console.log("Session:", req.session);
        console.log("User:", req.user);

        const accessToken = req.user.accessToken;

        const emails = await getInboxEmails(accessToken);

        sendResponse(
            res,
            200,
            true,
            "Inbox fetched successfully",
            emails
        );
    } 
     catch (error) {
        next(error);
    }

};

module.exports = {
    getEmails
};