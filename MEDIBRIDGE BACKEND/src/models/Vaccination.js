const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vaccination = sequelize.define(
  "Vaccination",
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

    vaccineName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    dateAdministered: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    dose: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    provider: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "vaccinations",
    timestamps: true,
  }
);

module.exports = Vaccination;