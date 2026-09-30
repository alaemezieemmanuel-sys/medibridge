const {
  Patient,
  Allergy,
  MedicalCondition,
  Medication,
} = require("../models");

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

const addAllergy = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  return Allergy.create({
    patientId: patient.id,
    allergen: data.allergen,
    reaction: data.reaction,
    severity: data.severity,
    notes: data.notes,
  });
};

const addMedicalCondition = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  return MedicalCondition.create({
    patientId: patient.id,
    name: data.name,
    diagnosedAt: data.diagnosedAt,
    status: data.status,
    notes: data.notes,
  });
};

const addMedication = async (userId, data) => {
  const patient = await getPatientByUserId(userId);

  return Medication.create({
    patientId: patient.id,
    name: data.name,
    dosage: data.dosage,
    frequency: data.frequency,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    notes: data.notes,
  });
};

module.exports = {
  addAllergy,
  addMedicalCondition,
  addMedication,
};
