const JWT = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || "$uperMan@123";

/**
 * Create JWT token for user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token = JWT.sign(payload, secret, { expiresIn: '24h' });
    return token;
}

/**
 * Validate JWT token
 * @param {string} token - JWT token to validate
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};