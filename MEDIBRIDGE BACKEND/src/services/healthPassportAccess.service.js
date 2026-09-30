const {
  Patient,
  Doctor,
  HealthPassport,
  HealthPassportAccess,
  Allergy,
  MedicalCondition,
  Medication,
} = require("../models");

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
 * Finds the Doctor profile belonging to the authenticated User.
 */
const getDoctorByUserId = async (userId) => {
  const doctor = await Doctor.findOne({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  return doctor;
};

/**
 * Patient grants a verified doctor access
 * to their Health Passport.
 */
const grantAccess = async (userId, doctorId) => {
  const patient = await getPatientByUserId(userId);

  const doctor = await Doctor.findByPk(doctorId);

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  // Only verified doctors can receive access.
  if (doctor.verificationStatus !== "VERIFIED") {
    throw new Error(
      "Only verified doctors can access Health Passports."
    );
  }

  // Make sure the patient has a Health Passport.
  const healthPassport = await HealthPassport.findOne({
    where: {
      patientId: patient.id,
    },
  });

  if (!healthPassport) {
    throw new Error(
      "You must create a Health Passport before granting access."
    );
  }

  const existingAccess = await HealthPassportAccess.findOne({
    where: {
      patientId: patient.id,
      doctorId: doctor.id,
    },
  });

  if (existingAccess) {
    if (existingAccess.status === "ACTIVE") {
      throw new Error(
        "This doctor already has access to your Health Passport."
      );
    }

    // Reactivate previously revoked access.
    existingAccess.status = "ACTIVE";
    existingAccess.grantedAt = new Date();
    existingAccess.expiresAt = null;

    await existingAccess.save();

    return existingAccess;
  }

  const access = await HealthPassportAccess.create({
    patientId: patient.id,
    doctorId: doctor.id,
    status: "ACTIVE",
    grantedAt: new Date(),
  });

  return access;
};

/**
 * Patient revokes a doctor's access.
 */
const revokeAccess = async (userId, doctorId) => {
  const patient = await getPatientByUserId(userId);

  const access = await HealthPassportAccess.findOne({
    where: {
      patientId: patient.id,
      doctorId,
    },
  });

  if (!access) {
    throw new Error("Access record not found.");
  }

  if (access.status === "REVOKED") {
    throw new Error(
      "This doctor already has no access to your Health Passport."
    );
  }

  access.status = "REVOKED";

  await access.save();

  return access;
};

/**
 * Gets all doctors who currently have access
 * to the patient's Health Passport.
 */
const getPatientAccessList = async (userId) => {
  const patient = await getPatientByUserId(userId);

  const accesses = await HealthPassportAccess.findAll({
    where: {
      patientId: patient.id,
      status: "ACTIVE",
    },
    include: [
      {
        model: Doctor,
        as: "doctor",
        attributes: [
          "id",
          "specialty",
          "qualifications",
          "verificationStatus",
        ],
        include: [
          {
            association: "user",
            attributes: ["id", "fullName", "email"],
          },
        ],
      },
    ],
  });

  return accesses;
};

/**
 * Doctor retrieves a patient's complete Health Passport,
 * but ONLY if the patient has granted access.
 */
const getPatientHealthPassport = async (
  userId,
  patientId
) => {
  const doctor = await getDoctorByUserId(userId);

  // Doctor must be verified.
  if (doctor.verificationStatus !== "VERIFIED") {
    throw new Error(
      "Only verified doctors can access Health Passports."
    );
  }

  const access = await HealthPassportAccess.findOne({
    where: {
      patientId,
      doctorId: doctor.id,
      status: "ACTIVE",
    },
  });

  if (!access) {
    throw new Error(
      "You do not have permission to access this patient's Health Passport."
    );
  }

  // Check expiration if one exists.
  if (
    access.expiresAt &&
    new Date(access.expiresAt) < new Date()
  ) {
    access.status = "REVOKED";
    await access.save();

    throw new Error(
      "Your access to this Health Passport has expired."
    );
  }

  const healthPassport = await HealthPassport.findOne({
    where: {
      patientId,
    },
  });

  if (!healthPassport) {
    throw new Error("Health Passport not found.");
  }

  const allergies = await Allergy.findAll({
    where: {
      patientId,
    },
  });

  const medicalConditions = await MedicalCondition.findAll({
    where: {
      patientId,
    },
  });

  const medications = await Medication.findAll({
    where: {
      patientId,
    },
  });

  const patient = await Patient.findByPk(patientId, {
    include: [
      {
        association: "user",
        attributes: ["id", "fullName", "email"],
      },
    ],
  });

  return {
    patient,
    healthPassport,
    allergies,
    medicalConditions,
    medications,
  };
};

module.exports = {
  grantAccess,
  revokeAccess,
  getPatientAccessList,
  getPatientHealthPassport,
};
