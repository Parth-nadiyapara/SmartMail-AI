const sendResponse = require("../utils/response.js");

const notFound = (req, res) => {
    
    sendResponse(
        res,
        404,
        false,
        "Route not found",
    );

};  

module.exports = notFound;