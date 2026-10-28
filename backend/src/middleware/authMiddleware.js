const crypto = require('crypto');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Constant-time string comparison to avoid leaking the admin key via timing attacks.
 */
const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Protects every /api/admin/* route.
 *
 * A valid key MUST be supplied either as:
 *   - header `x-admin-key: <ADMIN_SECRET_KEY>`
 *   - header `Authorization: Bearer <ADMIN_SECRET_KEY>`
 *
 * Missing or invalid credentials produce 401 (never a silent pass-through).
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

  const headerKey = req.headers['x-admin-key'];
  const providedKey = (typeof headerKey === 'string' ? headerKey.trim() : null) || bearerToken;

  if (!providedKey) {
    return next(
      new ApiError(401, 'Administrator credentials are required to access this resource.', [
        { field: 'x-admin-key', message: 'Missing admin key. Send it in the x-admin-key or Authorization header.' },
      ])
    );
  }

  if (!safeEqual(providedKey, env.ADMIN_SECRET_KEY)) {
    return next(
      new ApiError(401, 'Invalid administrator credentials.', [
        { field: 'x-admin-key', message: 'The supplied admin key is not valid.' },
      ])
    );
  }

  return next();
};

module.exports = authMiddleware;
