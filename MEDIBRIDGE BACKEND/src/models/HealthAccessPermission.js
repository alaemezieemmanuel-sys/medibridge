const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthAccessPermission = sequelize.define(
  "HealthAccessPermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accessGrantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    resourceType: {
      type: DataTypes.ENUM(
        "HEALTH_PROFILE",
        "ALLERGY",
        "MEDICAL_CONDITION",
        "MEDICATION",
        "VACCINATION",
        "LAB_RESULT",
        "MEDICAL_HISTORY",
        "CONSULTATION"
      ),
      allowNull: false,
    },

    permission: {
      type: DataTypes.ENUM("READ"),
      allowNull: false,
      defaultValue: "READ",
    },
  },
  {
    tableName: "health_access_permissions",
    timestamps: true,
  }
);

module.exports = HealthAccessPermission;