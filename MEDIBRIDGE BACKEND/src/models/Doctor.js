const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    specialty: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    qualifications: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    medicalLicenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    consultationPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    verificationStatus: {
      type: DataTypes.ENUM(
        "PENDING",
        "VERIFIED",
        "REJECTED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
  }
);

module.exports = Doctor;