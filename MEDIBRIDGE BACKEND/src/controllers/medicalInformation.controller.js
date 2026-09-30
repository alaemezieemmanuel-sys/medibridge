const medicalInformationService = require("../services/medicalInformation.service");

const addAllergy = async (req, res) => {
  try {
    const allergy = await medicalInformationService.addAllergy(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      message: "Allergy added successfully.",
      data: {
        allergy,
      },
    });
  } catch (error) {
    console.error("Add allergy error:", error);

    return res.status(400).json({
      message: error.message || "Unable to add allergy.",
    });
  }
};

const addMedicalCondition = async (req, res) => {
  try {
    const condition =
      await medicalInformationService.addMedicalCondition(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      message: "Medical condition added successfully.",
      data: {
        condition,
      },
    });
  } catch (error) {
    console.error("Add medical condition error:", error);

    return res.status(400).json({
      message:
        error.message || "Unable to add medical condition.",
    });
  }
};

const addMedication = async (req, res) => {
  try {
    const medication =
      await medicalInformationService.addMedication(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      message: "Medication added successfully.",
      data: {
        medication,
      },
    });
  } catch (error) {
    console.error("Add medication error:", error);

    return res.status(400).json({
      message: error.message || "Unable to add medication.",
    });
  }
};

module.exports = {
  addAllergy,
  addMedicalCondition,
  addMedication,
};
