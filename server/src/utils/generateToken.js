const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a given user ID.
 * @param {string} id - The user's MongoDB _id
 * @returns {string} Signed JWT token
 */
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-dev-only', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = generateToken;
