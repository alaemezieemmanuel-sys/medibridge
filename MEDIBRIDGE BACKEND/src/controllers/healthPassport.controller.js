const healthPassportService = require("../services/healthPassport.service");

/**
 * Creates a Health Passport for the authenticated patient.
 */
const createHealthPassport = async (req, res) => {
  try {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({
        message: "Only patients can create a Health Passport.",
      });
    }

    const healthPassport =
      await healthPassportService.createHealthPassport(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      message: "Health Passport created successfully.",
      data: {
        healthPassport,
      },
    });
  } catch (error) {
    console.error("Create Health Passport error:", error);

    return res.status(400).json({
      message:
        error.message || "Unable to create Health Passport.",
    });
  }
};

/**
 * Gets the authenticated patient's Health Passport.
 */
const getHealthPassport = async (req, res) => {
  try {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({
        message: "Only patients can access this Health Passport.",
      });
    }

    const healthPassport =
      await healthPassportService.getHealthPassport(
        req.user.id
      );

    return res.status(200).json({
      message: "Health Passport retrieved successfully.",
      data: {
        healthPassport,
      },
    });
  } catch (error) {
    console.error("Get Health Passport error:", error);

    return res.status(404).json({
      message:
        error.message || "Health Passport not found.",
    });
  }
};

/**
 * Updates the authenticated patient's Health Passport.
 */
const updateHealthPassport = async (req, res) => {
  try {
    if (req.user.role !== "PATIENT") {
      return res.status(403).json({
        message: "Only patients can update a Health Passport.",
      });
    }

    const healthPassport =
      await healthPassportService.updateHealthPassport(
        req.user.id,
        req.body
      );

    return res.status(200).json({
      message: "Health Passport updated successfully.",
      data: {
        healthPassport,
      },
    });
  } catch (error) {
    console.error("Update Health Passport error:", error);

    return res.status(400).json({
      message:
        error.message || "Unable to update Health Passport.",
    });
  }
};

module.exports = {
  createHealthPassport,
  getHealthPassport,
  updateHealthPassport,
};
