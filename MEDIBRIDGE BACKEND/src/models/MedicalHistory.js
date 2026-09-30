const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MedicalHistory = sequelize.define(
  "MedicalHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "medical_history",
    timestamps: true,
  }
);

module.exports = MedicalHistory;