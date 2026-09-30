
const doctorService = require("../services/doctor.service");

/**
 * Returns all verified doctors.
 *
 * Optional query:
 * ?specialty=Cardiology
 */
const getVerifiedDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;

    const doctors =
      await doctorService.getVerifiedDoctors(specialty);

    return res.status(200).json({
      message: "Verified doctors retrieved successfully.",
      data: {
        doctors,
      },
    });
  } catch (error) {
    console.error("Get verified doctors error:", error);

    return res.status(500).json({
      message: "Unable to retrieve doctors.",
    });
  }
};

module.exports = {
  getVerifiedDoctors,
};
