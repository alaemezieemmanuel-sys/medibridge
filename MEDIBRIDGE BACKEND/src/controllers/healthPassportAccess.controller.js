const healthPassportAccessService = require("../services/healthPassportAccess.service");

/**
 * Patient grants a doctor access to their Health Passport.
 */
const grantAccess = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const access =
      await healthPassportAccessService.grantAccess(
        req.user.id,
        doctorId
      );

    return res.status(201).json({
      message:
        "Doctor has been granted access to your Health Passport.",
      data: {
        access,
      },
    });
  } catch (error) {
    console.error("Grant Health Passport access error:", error);

    return res.status(400).json({
      message:
        error.message ||
        "Unable to grant Health Passport access.",
    });
  }
};

/**
 * Patient revokes a doctor's access.
 */
const revokeAccess = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const access =
      await healthPassportAccessService.revokeAccess(
        req.user.id,
        doctorId
      );

    return res.status(200).json({
      message:
        "Doctor's access to your Health Passport has been revoked.",
      data: {
        access,
      },
    });
  } catch (error) {
    console.error("Revoke Health Passport access error:", error);

    return res.status(400).json({
      message:
        error.message ||
        "Unable to revoke Health Passport access.",
    });
  }
};

/**
 * Patient views doctors who currently have access.
 */
const getPatientAccessList = async (req, res) => {
  try {
    const accesses =
      await healthPassportAccessService.getPatientAccessList(
        req.user.id
      );

    return res.status(200).json({
      message: "Health Passport access list retrieved successfully.",
      data: {
        accesses,
      },
    });
  } catch (error) {
    console.error("Get access list error:", error);

    return res.status(400).json({
      message:
        error.message ||
        "Unable to retrieve Health Passport access list.",
    });
  }
};

/**
 * Verified doctor views an authorized patient's
 * complete Health Passport.
 */
const getPatientHealthPassport = async (req, res) => {
  try {
    const { patientId } = req.params;

    const passport =
      await healthPassportAccessService.getPatientHealthPassport(
        req.user.id,
        patientId
      );

    return res.status(200).json({
      message:
        "Patient Health Passport retrieved successfully.",
      data: passport,
    });
  } catch (error) {
    console.error(
      "Get patient Health Passport error:",
      error
    );

    return res.status(403).json({
      message:
        error.message ||
        "You do not have access to this Health Passport.",
    });
  }
};

module.exports = {
  grantAccess,
  revokeAccess,
  getPatientAccessList,
  getPatientHealthPassport,
};