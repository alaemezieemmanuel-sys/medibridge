const express = require("express");

const doctorController = require("../controllers/doctor.controller");

const router = express.Router();

/**
 * Get verified doctors.
 *
 * GET /api/doctors
 * GET /api/doctors?specialty=Cardiology
 */
router.get("/", doctorController.getVerifiedDoctors);

module.exports = router;
