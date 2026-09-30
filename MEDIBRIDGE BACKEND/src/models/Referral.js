const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Referral = sequelize.define(
  "Referral",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    consultationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("LOW", "NORMAL", "HIGH", "URGENT"),
      allowNull: false,
      defaultValue: "NORMAL",
    },

    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "referrals",
    timestamps: true,
  }
);

module.exports = Referral;