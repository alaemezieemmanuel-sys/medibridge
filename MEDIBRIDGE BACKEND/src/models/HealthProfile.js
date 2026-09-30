const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthProfile = sequelize.define(
  "HealthProfile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    bloodGroup: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "health_profiles",
    timestamps: true,
  }
);

module.exports = HealthProfile;