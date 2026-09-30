const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DoctorLanguage = sequelize.define(
  "DoctorLanguage",
  {
    doctorId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    languageId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    tableName: "doctor_languages",
    timestamps: false,
  }
);

module.exports = DoctorLanguage;