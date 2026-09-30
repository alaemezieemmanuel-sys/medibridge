const express = require("express");

const healthPassportController = require("../controllers/healthPassport.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

/*
 * Create Health Passport
 *
 * POST /api/health-passport
 */
router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  healthPassportController.createHealthPassport
);

/*
 * Get Health Passport
 *
 * GET /api/health-passport
 */
router.get(
  "/",
  authenticate,
  authorize("PATIENT"),
  healthPassportController.getHealthPassport
);

/*
 * Update Health Passport
 *
 * PATCH /api/health-passport
 */
router.patch(
  "/",
  authenticate,
  authorize("PATIENT"),
  healthPassportController.updateHealthPassport
);

module.exports = router;
