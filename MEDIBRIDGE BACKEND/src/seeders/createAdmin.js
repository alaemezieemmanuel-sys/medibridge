
require("dotenv").config();

const { sequelize, User } = require("../models");

const createAdmin = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();

    console.log("Database connection established.");

    // Check if an admin already exists
    const existingAdmin = await User.findOne({
      where: {
        role: "ADMIN",
      },
    });

    if (existingAdmin) {
      console.log("An admin account already exists.");
      console.log(`Admin email: ${existingAdmin.email}`);
      return;
    }

    const email = "admin@medibridge.com";
    const password = "AdminPassword123!";

    // Check whether this email is already being used
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error(
        `The email ${email} is already being used by another account.`
      );
    }

    /*
     * IMPORTANT:
     *
     * We DO NOT hash the password here.
     *
     * User.js already has a beforeCreate hook that
     * automatically hashes passwords.
     */
    const admin = await User.create({
      fullName: "MEDIBRIDGE Admin",
      email,
      password,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("======================================");
    console.log("Admin account created successfully.");
    console.log("======================================");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Status: ${admin.status}`);
    console.log("======================================");
  } catch (error) {
    console.error("Failed to create admin account:", error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();

