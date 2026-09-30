const bcrypt = require("bcryptjs");

const {
  sequelize,
  User,
  Patient,
  Doctor,
  EmergencyContact,
  DoctorDocument,
} = require("../models");

const { generateToken } = require("../utils/jwt");


/**
 * Returns only information that is safe to expose.
 *
 * Never return the user's password hash.
 */
const sanitizeUser = (user) => {
  const userData = user.toJSON();

  delete userData.password;

  return userData;
};


/**
 * Registers a new patient.
 */
const registerPatient = async ({
  fullName,
  email,
  phone,
  password,
  dateOfBirth,
  gender,
  location,
  emergencyContact,
}) => {
    email = email.trim().toLowerCase();
  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const user = await User.create(
      {
        fullName,
        email,
        phone,
        password,
        role: "PATIENT",
        status: "ACTIVE",
      },
      { transaction }
    );

    const patient = await Patient.create(
      {
        userId: user.id,
        dateOfBirth,
        gender,
        location,
      },
      { transaction }
    );

    await EmergencyContact.create(
      {
        patientId: patient.id,
        name: emergencyContact.name,
        phone: emergencyContact.phone,
        relationship: emergencyContact.relationship,
      },
      { transaction }
    );

    await transaction.commit();

    const token = generateToken(user);

    return {
      user: sanitizeUser(user),
      patient,
      token,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};


/**
 * Registers a new doctor.
 *
 * New doctors always start as PENDING.
 */
const registerDoctor = async ({
  fullName,
  email,
  phone,
  password,
  specialty,
  qualifications,
  medicalLicenseNumber,
  consultationPrice,
  documents = [],
}) => {

    email = email.trim().toLowerCase();
  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const existingLicense = await Doctor.findOne({
      where: { medicalLicenseNumber },
      transaction,
    });

    if (existingLicense) {
      throw new Error(
        "A doctor with this medical license number already exists."
      );
    }

    const user = await User.create(
      {
        fullName,
        email,
        phone,
        password,
        role: "DOCTOR",
        status: "ACTIVE",
      },
      { transaction }
    );

    const doctor = await Doctor.create(
      {
        userId: user.id,
        specialty,
        qualifications,
        medicalLicenseNumber,
        consultationPrice,
        verificationStatus: "PENDING",
      },
      { transaction }
    );

    /*
     * Professional documents are optional here because
     * the exact document storage mechanism has not yet
     * been implemented.
     */
    for (const document of documents) {
      await DoctorDocument.create(
        {
          doctorId: doctor.id,
          documentType: document.documentType,
          fileUrl: document.fileUrl,
          verificationStatus: "PENDING",
        },
        { transaction }
      );
    }

    await transaction.commit();

    const token = generateToken(user);

    return {
      user: sanitizeUser(user),
      doctor,
      token,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};



/**
 * Logs an existing user into the platform.
 */
const login = async ({ email, password }) => {
    email = email.trim().toLowerCase();
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active.");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};


/**
 * Approves a pending doctor.
 */
const verifyDoctor = async (doctorId) => {
  const doctor = await Doctor.findByPk(doctorId);

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  if (doctor.verificationStatus === "VERIFIED") {
    throw new Error("Doctor is already verified.");
  }

  if (doctor.verificationStatus === "REJECTED") {
    throw new Error(
      "A rejected doctor cannot be verified through this operation."
    );
  }

  doctor.verificationStatus = "VERIFIED";

  await doctor.save();

  return doctor;
};

/**
 * Rejects a pending doctor.
 */
const rejectDoctor = async (doctorId) => {
  const doctor = await Doctor.findByPk(doctorId);

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  if (doctor.verificationStatus === "VERIFIED") {
    throw new Error(
      "A verified doctor cannot be rejected through this operation."
    );
  }

  doctor.verificationStatus = "REJECTED";

  await doctor.save();

  return doctor;
};



module.exports = {
  registerPatient,
  registerDoctor,
  login,
  verifyDoctor,
  rejectDoctor,
  sanitizeUser,
};