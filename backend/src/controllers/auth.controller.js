const sendResponse = require("../utils/response");

const { getAuthenticatedUser } = require("../services/auth.service");

const googleCallback = (req, res) => {

    console.log("===== REQ.USER =====");
    console.log(req.user);
    const user = getAuthenticatedUser(req.user);

    sendResponse(res, 200, true, "Google Login Successful", user);

};

module.exports = {
    googleCallback
};