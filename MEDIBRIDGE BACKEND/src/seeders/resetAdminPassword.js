require("dotenv").config();

const { sequelize, User } = require("../models");

const resetAdminPassword = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection established.");

    const admin = await User.findOne({
      where: {
        email: "admin@medibridge.com",
        role: "ADMIN",
      },
    });

    if (!admin) {
      throw new Error("Admin account not found.");
    }

    /*
     * We assign the plain password here.
     *
     * User.js has a beforeUpdate hook that will
     * automatically hash it once.
     */
    admin.password = "AdminPassword123!";

    await admin.save();

    console.log("======================================");
    console.log("Admin password reset successfully.");
    console.log("======================================");
    console.log(`Email: ${admin.email}`);
    console.log("Password: AdminPassword123!");
    console.log(`Role: ${admin.role}`);
    console.log("======================================");
  } catch (error) {
    console.error("Failed to reset admin password:", error);
  } finally {
    await sequelize.close();
  }
};

resetAdminPassword();