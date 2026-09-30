const express = require("express");

const consultationController = require("../controllers/consultation.controller");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();


/*
 * PATIENT
 *
 * Request a consultation.
 *
 * POST /api/consultations
 */
router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  consultationController.requestConsultation
);


/*
 * PATIENT
 *
 * Mock payment for a consultation.
 *
 * PATCH /api/consultations/:consultationId/pay
 */
router.patch(
  "/:consultationId/pay",
  authenticate,
  authorize("PATIENT"),
  consultationController.payForConsultation
);

/*
 * PATIENT
 *
 * Get all their consultations.
 *
 * GET /api/consultations/patient
 */
router.get(
  "/patient",
  authenticate,
  authorize("PATIENT"),
  consultationController.getPatientConsultations
);


/*
 * DOCTOR
 *
 * Get all consultations assigned to them.
 *
 * GET /api/consultations/doctor
 */
router.get(
  "/doctor",
  authenticate,
  authorize("DOCTOR"),
  consultationController.getDoctorConsultations
);


/*
 * PATIENT
 *
 * Cancel a consultation.
 *
 * DELETE /api/consultations/:consultationId
 */
router.delete(
  "/:consultationId",
  authenticate,
  authorize("PATIENT"),
  consultationController.cancelConsultation
);


/*
 * DOCTOR
 *
 * Accept and schedule a consultation.
 *
 * PATCH /api/consultations/:consultationId/accept
 */
router.patch(
  "/:consultationId/accept",
  authenticate,
  authorize("DOCTOR"),
  consultationController.acceptConsultation
);


/*
 * DOCTOR
 *
 * Decline a consultation.
 *
 * PATCH /api/consultations/:consultationId/decline
 */
router.patch(
  "/:consultationId/decline",
  authenticate,
  authorize("DOCTOR"),
  consultationController.declineConsultation
);


/*
 * DOCTOR
 *
 * Complete a scheduled consultation.
 *
 * PATCH /api/consultations/:consultationId/complete
 */
router.patch(
  "/:consultationId/complete",
  authenticate,
  authorize("DOCTOR"),
  consultationController.completeConsultation
);

/*
 * PATIENT or DOCTOR
 *
 * View a specific consultation.
 *
 * GET /api/consultations/:consultationId
 */
router.get(
  "/:consultationId",
  authenticate,
  consultationController.getConsultation
);


module.exports = router;
