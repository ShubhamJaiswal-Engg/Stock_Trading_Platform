const jwt = require("jsonwebtoken");

/**
 * Optionally attaches req.user if a valid JWT is present.
 * Does NOT block the request when missing/invalid.
 *
 * Accepts token from:
 *  - Cookie: token
 *  - Header: Authorization: Bearer <token>
 */
module.exports.optionalAuth = (req, _res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    const token = cookieToken || bearerToken;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (decoded?.id) req.user = { id: decoded.id };
  } catch (_err) {
    // Ignore invalid/expired token for optional auth.
  }

  return next();
};
