const { Doctor, User } = require("../models");

/**
 * Get verified doctors.
 *
 * If specialty is provided, only doctors
 * matching that specialty are returned.
 */
const getVerifiedDoctors = async (specialty) => {
  const where = {
    verificationStatus: "VERIFIED",
  };

  if (specialty) {
    where.specialty = specialty.trim();
  }

  const doctors = await Doctor.findAll({
    where,

    attributes: [
      "id",
      "specialty",
      "qualifications",
      "consultationPrice",
      "verificationStatus",
    ],

    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fullName"],
        where: {
          status: "ACTIVE",
          role: "DOCTOR",
        },
      },
    ],

    order: [["createdAt", "DESC"]],
  });

  return doctors;
};

module.exports = {
  getVerifiedDoctors,
};
