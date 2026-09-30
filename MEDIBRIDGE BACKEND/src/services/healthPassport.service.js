const { HealthPassport, Patient, Allergy, MedicalCondition, Medication, } = require("../models");
/**
 * Finds the Patient profile belonging to the authenticated User.
 */
const getPatientByUserId = async (userId) => {
  const patient = await Patient.findOne({
    where: {
      userId,
    },
  });

  if (!patient) {
    throw new Error("Patient profile not found.");
  }

  return patient;
};

/**
 * Creates a Health Passport for the authenticated patient.
 */
const createHealthPassport = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  // A patient can only have one Health Passport.
  const existingPassport = await HealthPassport.findOne({
    where: {
      patientId: patient.id,
    },
  });

  if (existingPassport) {
    throw new Error(
      "Health Passport already exists for this patient."
    );
  }

  const healthPassport = await HealthPassport.create({
    patientId: patient.id,
    bloodGroup: data.bloodGroup,
    genotype: data.genotype,
    height: data.height,
    weight: data.weight,
    notes: data.notes,
  });

  return healthPassport;
};

/**
 * Gets the authenticated patient's Health Passport.
 */

/**
 * Gets the authenticated patient's complete Health Passport.
 *
 * Includes:
 * - Basic health information
 * - Allergies
 * - Medical conditions
 * - Medications
 */
const getHealthPassport = async (userId) => {
  const patient = await getPatientByUserId(userId);

  const healthPassport = await HealthPassport.findOne({
    where: {
      patientId: patient.id,
    },
  });

  if (!healthPassport) {
    throw new Error("Health Passport not found.");
  }

  const allergies = await Allergy.findAll({
    where: {
      patientId: patient.id,
    },
  });

  const medicalConditions = await MedicalCondition.findAll({
    where: {
      patientId: patient.id,
    },
  });

  const medications = await Medication.findAll({
    where: {
      patientId: patient.id,
    },
  });

  return {
    ...healthPassport.toJSON(),
    allergies,
    medicalConditions,
    medications,
  };
};

/**
 * Updates the authenticated patient's Health Passport.
 */
const updateHealthPassport = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  const healthPassport = await HealthPassport.findOne({
    where: {
      patientId: patient.id,
    },
  });

  if (!healthPassport) {
    throw new Error("Health Passport not found.");
  }

  await healthPassport.update({
    bloodGroup: data.bloodGroup,
    genotype: data.genotype,
    height: data.height,
    weight: data.weight,
    notes: data.notes,
  });

  return healthPassport;
};

module.exports = {
  createHealthPassport,
  getHealthPassport,
  updateHealthPassport,
};
