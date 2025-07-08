const { validateToken } = require("../services/authentication");

/**
 * Middleware to check for authentication cookie
 * @param {string} cookieName - Name of the cookie to check
 * @returns {Function} Middleware function
 */
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        
        if (!tokenCookieValue) {
            return next(); // No token found, proceed without authentication
        }

        try {
            // Validate token and attach user payload to request
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next();
        } catch (error) {
            console.error("Token validation failed:", error);
            return next(); // Token is invalid, proceed without authentication
        }
    };
}

module.exports = {
    checkForAuthenticationCookie,
};