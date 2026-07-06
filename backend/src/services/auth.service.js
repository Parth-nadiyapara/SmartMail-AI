/**
 * Authentication Service
 * Handles authentication-related business logic.
 */

const getAuthenticatedUser = (user) => {

    return {
        id: user.id,
        name: user.displayName,
        email: user.emails[0].value,
        photo: user.photos[0].value
    };

};

module.exports = {
    getAuthenticatedUser
};