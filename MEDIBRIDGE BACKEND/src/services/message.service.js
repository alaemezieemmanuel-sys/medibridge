const {
  Consultation,
  Message,
  Patient,
  Doctor,
} = require("../models");


/**
 * Gets the patient and doctor IDs associated
 * with a user.
 */
const getParticipantInfo = async (userId) => {
  const patient = await Patient.findOne({
    where: {
      userId,
    },
  });

  const doctor = await Doctor.findOne({
    where: {
      userId,
    },
  });

  return {
    patient,
    doctor,
  };
};


/**
 * Makes sure the authenticated user is actually
 * a participant in the consultation.
 */
const getConsultationForParticipant = async (
  userId,
  consultationId
) => {
  const consultation =
    await Consultation.findByPk(consultationId);

  if (!consultation) {
    throw new Error("Consultation not found.");
  }

  const { patient, doctor } =
    await getParticipantInfo(userId);

  const isPatient =
    patient &&
    consultation.patientId === patient.id;

  const isDoctor =
    doctor &&
    consultation.doctorId === doctor.id;

  if (!isPatient && !isDoctor) {
    throw new Error(
      "You are not a participant in this consultation."
    );
  }

  return consultation;
};


/**
 * Sends a message in a consultation.
 */
const sendMessage = async (
  userId,
  consultationId,
  body
) => {
  const consultation =
    await getConsultationForParticipant(
      userId,
      consultationId
    );

  if (!body || !body.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const message = await Message.create({
    consultationId: consultation.id,
    senderId: userId,
    body: body.trim(),
  });

  return message;
};


/**
 * Gets all messages belonging to a consultation.
 */
const getMessages = async (
  userId,
  consultationId
) => {
  await getConsultationForParticipant(
    userId,
    consultationId
  );

  const messages = await Message.findAll({
    where: {
      consultationId,
    },
    order: [["createdAt", "ASC"]],
  });

  return messages;
};


module.exports = {
  sendMessage,
  getMessages,
};