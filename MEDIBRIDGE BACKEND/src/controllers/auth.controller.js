
const authService = require("../services/auth.service");

/**
 * Register a new patient.
 *
 * The controller is responsible for:
 * 1. Receiving the HTTP request
 * 2. Passing the data to the service
 * 3. Sending the appropriate HTTP response
 *
 * Business logic stays inside auth.service.js.
 */
const registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      location,
      emergencyContact,
    } = req.body;

    // Basic required-field validation
    if (
      !fullName ||
      !email ||
      !password ||
      !dateOfBirth ||
      !gender ||
      !location ||
      !emergencyContact
    ) {
      return res.status(400).json({
        message: "Please provide all required patient information.",
      });
    }

    // Emergency contact must contain the required information
    if (
      !emergencyContact.name ||
      !emergencyContact.phone ||
      !emergencyContact.relationship
    ) {
      return res.status(400).json({
        message: "Please provide complete emergency contact information.",
      });
    }

    const result = await authService.registerPatient({
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      location,
      emergencyContact,
    });

    return res.status(201).json({
      message: "Patient account created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Patient registration error:", error);

    return res.status(400).json({
      message: error.message || "Unable to register patient.",
    });
  }
};

/**
 * Register a new doctor.
 *
 * Newly registered doctors are created with
 * verificationStatus = PENDING by the service.
 */
const registerDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      specialty,
      qualifications,
      medicalLicenseNumber,
      consultationPrice,
      documents,
    } = req.body;

    // Required doctor information
    if (
      !fullName ||
      !email ||
      !password ||
      !specialty ||
      !qualifications ||
      !medicalLicenseNumber
    ) {
      return res.status(400).json({
        message: "Please provide all required doctor information.",
      });
    }

    const result = await authService.registerDoctor({
      fullName,
      email,
      phone,
      password,
      specialty,
      qualifications,
      medicalLicenseNumber,
      consultationPrice,
      documents,
    });

    return res.status(201).json({
      message:
        "Doctor account created successfully. Your account is awaiting verification.",
      data: result,
    });
  } catch (error) {
    console.error("Doctor registration error:", error);

    return res.status(400).json({
      message: error.message || "Unable to register doctor.",
    });
  }
};

/**
 * Log a user into MEDIBRIDGE.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const result = await authService.login({
      email,
      password,
    });

    return res.status(200).json({
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      message: error.message || "Invalid email or password.",
    });
  }
};

/**
 * Get the currently authenticated user.
 *
 * This endpoint will be protected by the authenticate
 * middleware, which places the authenticated user in req.user.
 */
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const user = authService.sanitizeUser(req.user);

    return res.status(200).json({
      message: "Authenticated user retrieved successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Unable to retrieve authenticated user.",
    });
  }
};

/**
 * Export authentication controllers.
 */
module.exports = {
  registerPatient,
  registerDoctor,
  login,
  getCurrentUser,
};

