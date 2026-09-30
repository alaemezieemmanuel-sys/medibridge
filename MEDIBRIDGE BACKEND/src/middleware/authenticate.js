const { User } = require("../models");
const { verifyToken } = require("../utils/jwt");

/**
 * Verifies that the request contains a valid JWT.
 *
 * If valid:
 *      req.user = authenticated user
 *
 * If invalid:
 *      request is rejected
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Your account is not active.",
      });
    }

    /*
     * Attach the authenticated user to the request.
     *
     * The password is intentionally excluded.
     */
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};

module.exports = authenticate;