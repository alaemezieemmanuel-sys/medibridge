const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FacilityEmergencyAvailability = sequelize.define(
  "FacilityEmergencyAvailability",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    emergencyAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    ambulanceAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "facility_emergency_availability",
    timestamps: true,
  }
);

module.exports = FacilityEmergencyAvailability;