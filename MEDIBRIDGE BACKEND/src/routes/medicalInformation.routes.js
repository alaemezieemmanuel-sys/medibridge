const express = require("express");

const medicalInformationController = require("../controllers/medicalInformation.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

/*
 * Add an allergy
 *
 * POST /api/medical-information/allergies
 */
router.post(
  "/allergies",
  authenticate,
  authorize("PATIENT"),
  medicalInformationController.addAllergy
);

/*
 * Add a medical condition
 *
 * POST /api/medical-information/conditions
 */
router.post(
  "/conditions",
  authenticate,
  authorize("PATIENT"),
  medicalInformationController.addMedicalCondition
);

/*
 * Add a medication
 *
 * POST /api/medical-information/medications
 */
router.post(
  "/medications",
  authenticate,
  authorize("PATIENT"),
  medicalInformationController.addMedication
);

module.exports = router;
