const sendResponse = require("../utils/response.js");

const errorHandler = (err, req, res, next) => {
    
    console.error(err);

    sendResponse(
        res,
        err.status || 500,
        false,
        err.message || "Internal Server Error",
    );

};

module.exports = errorHandler;