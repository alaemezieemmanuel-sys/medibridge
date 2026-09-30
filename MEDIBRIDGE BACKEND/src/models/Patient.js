const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Patient = sequelize.define(
  "Patient",
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

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM(
        "MALE",
        "FEMALE",
        "OTHER",
        "PREFER_NOT_TO_SAY"
      ),
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "patients",
    timestamps: true,
  }
);

module.exports = Patient;