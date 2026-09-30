const authService = require("../services/auth.service");

/**
 * Verify a doctor.
 *
 * Only an authenticated ADMIN should be able
 * to reach this controller.
 */
const verifyDoctor = async (req, res) => {
	try {
		const { doctorId } = req.params;

		if (!doctorId) {
			return res.status(400).json({
				message: "Doctor ID is required.",
			});
		}

		const doctor = await authService.verifyDoctor(doctorId);

		return res.status(200).json({
			message: "Doctor verified successfully.",
			data: {
				doctor,
			},
		});
	} catch (error) {
		console.error("Doctor verification error:", error);

		return res.status(400).json({
			message: error.message || "Unable to verify doctor.",
		});
	}
};

/**
 * Reject a doctor.
 *
 * Only an authenticated ADMIN should be able
 * to reach this controller.
 */
const rejectDoctor = async (req, res) => {
	try {
		const { doctorId } = req.params;

		if (!doctorId) {
			return res.status(400).json({
				message: "Doctor ID is required.",
			});
		}

		const doctor = await authService.rejectDoctor(doctorId);

		return res.status(200).json({
			message: "Doctor rejected successfully.",
			data: {
				doctor,
			},
		});
	} catch (error) {
		console.error("Doctor rejection error:", error);

		return res.status(400).json({
			message: error.message || "Unable to reject doctor.",
		});
	}
};

module.exports = {
	verifyDoctor,
	rejectDoctor,
};