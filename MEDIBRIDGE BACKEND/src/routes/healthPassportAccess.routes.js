const express = require("express");

const healthPassportAccessController = require("../controllers/healthPassportAccess.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

/*
 * Patient grants a doctor access.
 *
 * POST /api/health-passport/access/:doctorId
 */
router.post(
  "/access/:doctorId",
  authenticate,
  authorize("PATIENT"),
  healthPassportAccessController.grantAccess
);

/*
 * Patient revokes a doctor's access.
 *
 * DELETE /api/health-passport/access/:doctorId
 */
router.delete(
  "/access/:doctorId",
  authenticate,
  authorize("PATIENT"),
  healthPassportAccessController.revokeAccess
);

/*
 * Patient views doctors who have access.
 *
 * GET /api/health-passport/access
 */
router.get(
  "/access",
  authenticate,
  authorize("PATIENT"),
  healthPassportAccessController.getPatientAccessList
);

/*
 * Doctor views an authorized patient's Health Passport.
 *
 * GET /api/health-passport/patient/:patientId
 */
router.get(
  "/patient/:patientId",
  authenticate,
  authorize("DOCTOR"),
  healthPassportAccessController.getPatientHealthPassport
);

module.exports = router;
