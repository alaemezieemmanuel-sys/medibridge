const { Doctor } = require("../models");

/**
 * Ensures that the authenticated user is a verified doctor.
 *
 * This middleware should be used after authenticate().
 */
const requireVerifiedDoctor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({
        message: "Only doctors can access this resource.",
      });
    }

    const doctor = await Doctor.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found.",
      });
    }

    if (doctor.verificationStatus !== "VERIFIED") {
      return res.status(403).json({
        message: "Doctor account has not been verified.",
      });
    }

    /*
     * Attach the doctor profile as well.
     * This saves us from querying it again later.
     */
    req.doctor = doctor;

    next();
  } catch (error) {
    console.error("Doctor verification error:", error);

    return res.status(500).json({
      message: "Unable to verify doctor status.",
    });
  }
};

module.exports = requireVerifiedDoctor;