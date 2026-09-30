const sequelize = require("../config/database");

// Import models
const User = require("./User");
const Patient = require("./Patient");
const Doctor = require("./Doctor");
const DoctorDocument = require("./DoctorDocument");
const EmergencyContact = require("./EmergencyContact");

const HealthProfile = require("./HealthProfile");
const Allergy = require("./Allergy");
const MedicalCondition = require("./MedicalCondition");
const Medication = require("./Medication");
const Vaccination = require("./Vaccination");
const LabResult = require("./LabResult");
const MedicalHistory = require("./MedicalHistory");

const Consultation = require("./Consultation");
const Message = require("./Message");

const HealthcareFacility = require("./HealthcareFacility");
const Referral = require("./Referral");

const EmergencyRequest = require("./EmergencyRequest");
const FacilityEmergencyAvailability = require(
  "./FacilityEmergencyAvailability"
);

const HealthAccessGrant = require("./HealthAccessGrant");
const HealthAccessPermission = require(
  "./HealthAccessPermission"
);
const AccessLog = require("./AccessLog");

const Language = require("./Language");
const DoctorLanguage = require("./DoctorLanguage");
const Translation = require("./Translation");

const AIConversation = require("./AIConversation");
const AIMessage = require("./AIMessage");

const HealthPassport = require("./HealthPassport");
const HealthPassportAccess = require("./HealthPassportAccess");
// ------------------------------------
// USER RELATIONSHIPS
// ------------------------------------

User.hasOne(Patient, {
  foreignKey: "userId",
  as: "patientProfile",
});

Patient.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(Doctor, {
  foreignKey: "userId",
  as: "doctorProfile",
});

Doctor.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ------------------------------------
// PATIENT RELATIONSHIPS
// ------------------------------------

Patient.hasMany(EmergencyContact, {
  foreignKey: "patientId",
  as: "emergencyContacts",
});

EmergencyContact.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasOne(HealthProfile, {
  foreignKey: "patientId",
  as: "healthProfile",
});

HealthProfile.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(Allergy, {
  foreignKey: "patientId",
  as: "allergies",
});

Allergy.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(MedicalCondition, {
  foreignKey: "patientId",
  as: "conditions",
});

MedicalCondition.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(Medication, {
  foreignKey: "patientId",
  as: "medications",
});

Medication.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(Vaccination, {
  foreignKey: "patientId",
  as: "vaccinations",
});

Vaccination.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(LabResult, {
  foreignKey: "patientId",
  as: "labResults",
});

LabResult.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(MedicalHistory, {
  foreignKey: "patientId",
  as: "medicalHistory",
});

MedicalHistory.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

// ------------------------------------
// DOCTOR RELATIONSHIPS
// ------------------------------------

Doctor.hasMany(DoctorDocument, {
  foreignKey: "doctorId",
  as: "documents",
});

DoctorDocument.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});

// ------------------------------------
// CONSULTATIONS
// ------------------------------------


Patient.hasMany(Consultation, {
  foreignKey: "patientId",
  as: "consultations",
});

Consultation.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});


Doctor.hasMany(Consultation, {
  foreignKey: "doctorId",
  as: "consultations",
});

Consultation.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});


Consultation.hasMany(Message, {
  foreignKey: "consultationId",
  as: "messages",
});

Message.belongsTo(Consultation, {
  foreignKey: "consultationId",
  as: "consultation",
});

User.hasMany(Message, {
  foreignKey: "senderId",
  as: "messages",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

// ------------------------------------
// REFERRALS
// ------------------------------------

HealthcareFacility.hasMany(Referral, {
  foreignKey: "facilityId",
  as: "referrals",
});

Referral.belongsTo(HealthcareFacility, {
  foreignKey: "facilityId",
  as: "facility",
});

Consultation.hasMany(Referral, {
  foreignKey: "consultationId",
  as: "referrals",
});

Referral.belongsTo(Consultation, {
  foreignKey: "consultationId",
  as: "consultation",
});

Patient.hasMany(Referral, {
  foreignKey: "patientId",
  as: "referrals",
});

Referral.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Doctor.hasMany(Referral, {
  foreignKey: "doctorId",
  as: "referrals",
});

Referral.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});

// ------------------------------------
// EMERGENCY
// ------------------------------------

Patient.hasMany(EmergencyRequest, {
  foreignKey: "patientId",
  as: "emergencyRequests",
});

EmergencyRequest.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

HealthcareFacility.hasOne(
  FacilityEmergencyAvailability,
  {
    foreignKey: "facilityId",
    as: "emergencyAvailability",
  }
);

FacilityEmergencyAvailability.belongsTo(
  HealthcareFacility,
  {
    foreignKey: "facilityId",
    as: "facility",
  }
);

HealthcareFacility.hasMany(EmergencyRequest, {
  foreignKey: "selectedFacilityId",
  as: "emergencyRequests",
});

EmergencyRequest.belongsTo(HealthcareFacility, {
  foreignKey: "selectedFacilityId",
  as: "selectedFacility",
});

// ------------------------------------
// HEALTH DATA ACCESS
// ------------------------------------

Patient.hasMany(HealthAccessGrant, {
  foreignKey: "patientId",
  as: "accessGrants",
});

HealthAccessGrant.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Doctor.hasMany(HealthAccessGrant, {
  foreignKey: "doctorId",
  as: "accessGrants",
});

HealthAccessGrant.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});

HealthAccessGrant.hasMany(HealthAccessPermission, {
  foreignKey: "accessGrantId",
  as: "permissions",
});

HealthAccessPermission.belongsTo(HealthAccessGrant, {
  foreignKey: "accessGrantId",
  as: "accessGrant",
});

// ------------------------------------
// ACCESS LOGS
// ------------------------------------

Patient.hasMany(AccessLog, {
  foreignKey: "patientId",
  as: "accessLogs",
});

AccessLog.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

User.hasMany(AccessLog, {
  foreignKey: "userId",
  as: "accessLogs",
});

AccessLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// ------------------------------------
// LANGUAGES
// ------------------------------------

Doctor.belongsToMany(Language, {
  through: DoctorLanguage,
  foreignKey: "doctorId",
  otherKey: "languageId",
  as: "languages",
});

Language.belongsToMany(Doctor, {
  through: DoctorLanguage,
  foreignKey: "languageId",
  otherKey: "doctorId",
  as: "doctors",
});

Message.hasMany(Translation, {
  foreignKey: "messageId",
  as: "translations",
});

Translation.belongsTo(Message, {
  foreignKey: "messageId",
  as: "message",
});

// ------------------------------------
// AI ASSISTANT
// ------------------------------------

Patient.hasMany(AIConversation, {
  foreignKey: "patientId",
  as: "aiConversations",
});

AIConversation.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

AIConversation.hasMany(AIMessage, {
  foreignKey: "conversationId",
  as: "messages",
});

AIMessage.belongsTo(AIConversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

Patient.hasOne(HealthPassport, {
  foreignKey: "patientId",
  as: "healthPassport",
});


Patient.hasMany(HealthPassportAccess, {
  foreignKey: "patientId",
  as: "passportAccesses",
});

HealthPassportAccess.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Doctor.hasMany(HealthPassportAccess, {
  foreignKey: "doctorId",
  as: "passportAccesses",
});

HealthPassportAccess.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctor",
});



module.exports = {
  sequelize,

  User,
  Patient,
  Doctor,
  DoctorDocument,
  EmergencyContact,

  HealthProfile,
  Allergy,
  MedicalCondition,
  Medication,
  Vaccination,
  LabResult,
  MedicalHistory,

  Consultation,
  Message,

  HealthcareFacility,
  Referral,

  EmergencyRequest,
  FacilityEmergencyAvailability,

  HealthAccessGrant,
  HealthAccessPermission,
  AccessLog,

  Language,
  DoctorLanguage,
  Translation,

  AIConversation,
  AIMessage,
  HealthPassport,
  HealthPassportAccess,
};