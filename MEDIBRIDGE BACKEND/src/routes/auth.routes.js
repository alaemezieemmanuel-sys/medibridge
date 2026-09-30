const express = require("express");

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/*
 * Patient registration
 *
 * POST /api/auth/register/patient
 */
router.post(
  "/register/patient",
  authController.registerPatient
);

/*
 * Doctor registration
 *
 * POST /api/auth/register/doctor
 */
router.post(
  "/register/doctor",
  authController.registerDoctor
);

/*
 * User login
 *
 * POST /api/auth/login
 */
router.post(
  "/login",
  authController.login
);

/*
 * Get currently authenticated user
 *
 * GET /api/auth/me
 *
 * This route requires a valid JWT.
 */
router.get(
  "/me",
  authenticate,
  authController.getCurrentUser
);

module.exports = router;

