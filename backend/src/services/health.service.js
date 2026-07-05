/**
 * Health Service
 *
 * Contains the business logic for checking
 * the backend health status.
 */

const getHealthStatus = () => {
    return {
        status : 'UP',
        service: "SmartMail AI Backend",
        version: "1.0.0",
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()

    };

};

module.exports = {
    getHealthStatus
};