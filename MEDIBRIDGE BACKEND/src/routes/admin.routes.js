const express = require("express");
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

/*
 * Verify a doctor
 *
 * PATCH /api/admin/doctors/:doctorId/verify
 *
 * Requires:
 * 1. Valid JWT
 * 2. ADMIN role
 */
router.patch(
	"/doctors/:doctorId/verify",
	authenticate,
	authorize("ADMIN"),
	adminController.verifyDoctor
);

/*
 * Reject a doctor
 *
 * PATCH /api/admin/doctors/:doctorId/reject
 *
 * Requires:
 * 1. Valid JWT
 * 2. ADMIN role
 */
router.patch(
	"/doctors/:doctorId/reject",
	authenticate,
	authorize("ADMIN"),
	adminController.rejectDoctor
);

module.exports = router;