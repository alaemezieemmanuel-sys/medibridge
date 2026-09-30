const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LabResult = sequelize.define(
  "LabResult",
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

    testName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    referenceRange: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    testDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    facility: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "lab_results",
    timestamps: true,
  }
);

module.exports = LabResult;