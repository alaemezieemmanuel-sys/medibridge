const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmergencyContact = sequelize.define(
  "EmergencyContact",
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

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    relationship: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "emergency_contacts",
    timestamps: true,
  }
);

module.exports = EmergencyContact;