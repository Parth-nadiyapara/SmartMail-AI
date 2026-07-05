const sendResponse = require("../utils/response");
const { getHealthStatus } = require("../services/health.service");

const healthCheck = (req, res) => {

    const healthData = getHealthStatus();

    sendResponse(
        res,
        200,
        true,
        "Backend is running successfully.",
        healthData
    );

};

module.exports = {
    healthCheck
};