
const consultationService = require("../services/consultation.service");


/**
 * Patient requests a consultation.
 */
const requestConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.requestConsultation(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      message: "Consultation requested successfully.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Request consultation error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to request consultation.",
    });
  }
};


/**
 * Gets one consultation.
 */
const getConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.getConsultation(
        req.user.id,
        req.params.consultationId
      );

    return res.status(200).json({
      message: "Consultation retrieved successfully.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Get consultation error:",
      error
    );

    return res.status(403).json({
      message:
        error.message ||
        "Unable to retrieve consultation.",
    });
  }
};


/**
 * Doctor accepts and schedules a consultation.
 */
const acceptConsultation = async (req, res) => {
  try {
    const { scheduledAt } = req.body;

    const consultation =
      await consultationService.acceptConsultation(
        req.user.id,
        req.params.consultationId,
        scheduledAt
      );

    return res.status(200).json({
      message:
        "Consultation accepted and scheduled successfully.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Accept consultation error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to accept consultation.",
    });
  }
};


/**
 * Doctor declines a consultation.
 */
const declineConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.declineConsultation(
        req.user.id,
        req.params.consultationId
      );

    return res.status(200).json({
      message: "Consultation declined.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Decline consultation error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to decline consultation.",
    });
  }
};


/**
 * Patient cancels a consultation.
 */
const cancelConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.cancelConsultation(
        req.user.id,
        req.params.consultationId
      );

    return res.status(200).json({
      message: "Consultation cancelled.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Cancel consultation error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to cancel consultation.",
    });
  }
};


/**
 * Gets all consultations belonging to the patient.
 */
const getPatientConsultations = async (req, res) => {
  try {
    const consultations =
      await consultationService.getPatientConsultations(
        req.user.id
      );

    return res.status(200).json({
      message:
        "Patient consultations retrieved successfully.",
      data: {
        consultations,
      },
    });
  } catch (error) {
    console.error(
      "Get patient consultations error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve consultations.",
    });
  }
};


/**
 * Gets all consultations belonging to the doctor.
 */
const getDoctorConsultations = async (req, res) => {
  try {
    const consultations =
      await consultationService.getDoctorConsultations(
        req.user.id
      );

    return res.status(200).json({
      message:
        "Doctor consultations retrieved successfully.",
      data: {
        consultations,
      },
    });
  } catch (error) {
    console.error(
      "Get doctor consultations error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve consultations.",
    });
  }
};


/**
 * Mock payment for a consultation.
 */
const payForConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.payForConsultation(
        req.user.id,
        req.params.consultationId
      );

    return res.status(200).json({
      message: "Payment successful.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Mock payment error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to process payment.",
    });
  }
};

/**
 * Doctor completes a scheduled consultation.
 */
const completeConsultation = async (req, res) => {
  try {
    const consultation =
      await consultationService.completeConsultation(
        req.user.id,
        req.params.consultationId,
        req.body
      );

    return res.status(200).json({
      message: "Consultation completed successfully.",
      data: {
        consultation,
      },
    });
  } catch (error) {
    console.error(
      "Complete consultation error:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Unable to complete consultation.",
    });
  }
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
