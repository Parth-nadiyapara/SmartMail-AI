/**
 * Authentication Service
 *
 * Handles authentication-related business logic.
 */

const getAuthenticatedUser = (user) => {
    return {
        id: user.databaseId,
        googleId: user.id,
        name: user.displayName,
        email: user.email,
        photo: user.photoUrl,
        role: user.role,
        dailyAnalysisLimit: user.dailyAnalysisLimit,
    };
};

module.exports = {
    getAuthenticatedUser,
};