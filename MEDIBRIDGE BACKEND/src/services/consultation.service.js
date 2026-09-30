const { Op } = require("sequelize");

const {
  Consultation,
  Patient,
  Doctor,
  User,
} = require("../models");


/**
 * Finds the Patient profile belonging to a User.
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
 * Finds the Doctor profile belonging to a User.
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
 * Patient requests a consultation.
 *
 * New consultations always start as:
 *
 * status = REQUESTED
 * paymentStatus = UNPAID
 */
const requestConsultation = async (
  userId,
  { doctorId, reason, symptoms }
) => {
  const patient = await getPatientByUserId(userId);

  if (!doctorId) {
    throw new Error("Doctor ID is required.");
  }

  if (!reason || !reason.trim()) {
    throw new Error("Reason for consultation is required.");
  }

  const doctor = await Doctor.findByPk(doctorId);

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  // Patients can only request consultations
  // with verified doctors.
  if (doctor.verificationStatus !== "VERIFIED") {
    throw new Error(
      "You can only request a consultation with a verified doctor."
    );
  }

  // Prevent multiple active requests between
  // the same patient and doctor.
  const existingConsultation =
    await Consultation.findOne({
      where: {
        patientId: patient.id,
        doctorId: doctor.id,
status: {
  [Op.in]: [
    "REQUESTED",
    "PAID",
    "SCHEDULED",
  ],
},
      },
    });

  if (existingConsultation) {
    throw new Error(
      "You already have an active consultation with this doctor."
    );
  }

  const consultation = await Consultation.create({
    patientId: patient.id,
    doctorId: doctor.id,
    reason: reason.trim(),
    symptoms: symptoms ? symptoms.trim() : null,
    status: "REQUESTED",
    paymentStatus: "UNPAID",
  });

  return consultation;
};


/**
 * Gets a consultation.
 *
 * Only the patient or assigned doctor can view it.
 */
const getConsultation = async (
  userId,
  consultationId
) => {
  const consultation = await Consultation.findByPk(
    consultationId,
    {
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "fullName"],
            },
          ],
        },
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "fullName"],
            },
          ],
        },
      ],
    }
  );

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  const patient = consultation.patient;
  const doctor = consultation.doctor;

  const isPatient =
    patient.userId === userId;

  const isDoctor =
    doctor.userId === userId;

  if (!isPatient && !isDoctor) {
    throw new Error(
      "You are not a participant in this consultation."
    );
  }

  return consultation;
};


/**
 * Doctor accepts a consultation.
 *
 * REQUESTED -> PAID
 *
 * The consultation must already have been paid
 * before the doctor can accept it.
 */
const acceptConsultation = async (
  userId,
  consultationId,
  scheduledAt
) => {
  const doctor = await getDoctorByUserId(userId);

  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  if (consultation.doctorId !== doctor.id) {
    throw new Error(
      "You are not the doctor assigned to this consultation."
    );
  }

  if (consultation.status !== "PAID") {
    throw new Error(
      "Only paid consultations can be accepted."
    );
  }

  if (!scheduledAt) {
    throw new Error(
      "Scheduled date and time are required."
    );
  }

  const appointmentDate = new Date(scheduledAt);

  if (Number.isNaN(appointmentDate.getTime())) {
    throw new Error(
      "Please provide a valid scheduled date and time."
    );
  }

  if (appointmentDate <= new Date()) {
    throw new Error(
      "Scheduled date and time must be in the future."
    );
  }

  consultation.status = "SCHEDULED";
  consultation.scheduledAt = appointmentDate;

  await consultation.save();

  return consultation;
};


/**
 * Doctor declines a consultation.
 *
 * REQUESTED or PAID -> DECLINED
 */
const declineConsultation = async (
  userId,
  consultationId
) => {
  const doctor = await getDoctorByUserId(userId);

  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  if (consultation.doctorId !== doctor.id) {
    throw new Error(
      "You are not the doctor assigned to this consultation."
    );
  }

  if (
    consultation.status !== "REQUESTED" &&
    consultation.status !== "PAID"
  ) {
    throw new Error(
      "This consultation can no longer be declined."
    );
  }

  consultation.status = "DECLINED";

  await consultation.save();

  return consultation;
};


/**
 * Patient cancels a consultation.
 *
 * REQUESTED or PAID -> CANCELLED
 *
 * A scheduled consultation cannot be cancelled
 * through this MVP operation.
 */
const cancelConsultation = async (
  userId,
  consultationId
) => {
  const patient = await getPatientByUserId(userId);

  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  if (consultation.patientId !== patient.id) {
    throw new Error(
      "You are not the patient who requested this consultation."
    );
  }

  if (
    consultation.status !== "REQUESTED" &&
    consultation.status !== "PAID"
  ) {
    throw new Error(
      "This consultation can no longer be cancelled."
    );
  }

  consultation.status = "CANCELLED";

  await consultation.save();

  return consultation;
};


/**
 * Gets the patient's consultations.
 */
const getPatientConsultations = async (userId) => {
  const patient = await getPatientByUserId(userId);

  return Consultation.findAll({
    where: {
      patientId: patient.id,
    },
    include: [
      {
        model: Doctor,
        as: "doctor",
        attributes: [
          "id",
          "specialty",
          "qualifications",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};


/**
 * Gets the doctor's consultations.
 */
const getDoctorConsultations = async (userId) => {
  const doctor = await getDoctorByUserId(userId);

  return Consultation.findAll({
    where: {
      doctorId: doctor.id,
    },
    include: [
      {
        model: Patient,
        as: "patient",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

/**
 * Mock payment for a consultation.
 *
 * This does NOT process real money.
 *
 * REQUESTED -> PAID
 * UNPAID -> PAID
 *
 * Only the patient who owns the consultation
 * can make the payment.
 */
const payForConsultation = async (
  userId,
  consultationId
) => {
  const patient = await getPatientByUserId(userId);

  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  // Make sure this patient owns the consultation.
  if (consultation.patientId !== patient.id) {
    throw new Error(
      "You are not the patient who requested this consultation."
    );
  }

  // Payment is only allowed while the consultation
  // is waiting for payment.
  if (consultation.status !== "REQUESTED") {
    throw new Error(
      "Only requested consultations can be paid for."
    );
  }

  if (consultation.paymentStatus === "PAID") {
    throw new Error(
      "This consultation has already been paid for."
    );
  }

  // Mock payment.
  consultation.paymentStatus = "PAID";
  consultation.status = "PAID";

  await consultation.save();

  return consultation;
};

/**
 * Doctor completes a scheduled consultation.
 *
 * SCHEDULED -> COMPLETED
 *
 * The assigned doctor can provide:
 * - doctorNotes
 * - referral
 *
 * At least one of the two must be provided.
 */
const completeConsultation = async (
  userId,
  consultationId,
  { doctorNotes, referral }
) => {
  const doctor = await getDoctorByUserId(userId);

  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  // Make sure this is the doctor assigned
  // to this consultation.
  if (consultation.doctorId !== doctor.id) {
    throw new Error(
      "You are not the doctor assigned to this consultation."
    );
  }

  // Only scheduled consultations can be completed.
  if (consultation.status !== "SCHEDULED") {
    throw new Error(
      "Only scheduled consultations can be completed."
    );
  }

  // At least one piece of clinical information
  // should be recorded.
  if (
    (!doctorNotes || !doctorNotes.trim()) &&
    (!referral || !referral.trim())
  ) {
    throw new Error(
      "Please provide doctor notes or a referral."
    );
  }

  consultation.doctorNotes = doctorNotes
    ? doctorNotes.trim()
    : null;

  consultation.referral = referral
    ? referral.trim()
    : null;

  consultation.status = "COMPLETED";

  await consultation.save();

  return consultation;
};


module.exports = {
  requestConsultation,
  getConsultation,
  acceptConsultation,
  declineConsultation,
  cancelConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  payForConsultation,
  completeConsultation
};



