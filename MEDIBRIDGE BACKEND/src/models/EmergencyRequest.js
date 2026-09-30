const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmergencyRequest = sequelize.define(
  "EmergencyRequest",
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

    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },

    selectedFacilityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "REQUESTED",
        "FACILITY_SELECTED",
        "ASSISTANCE_REQUESTED",
        "ACCEPTED",
        "COMPLETED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "REQUESTED",
    },
  },
  {
    tableName: "emergency_requests",
    timestamps: true,
  }
);

module.exports = EmergencyRequest;