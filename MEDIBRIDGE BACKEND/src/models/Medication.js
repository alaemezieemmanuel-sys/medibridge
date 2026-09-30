const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Medication = sequelize.define(
  "Medication",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Medication name is required.",
        },
      },
    },

    dosage: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    frequency: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "COMPLETED", "DISCONTINUED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "medications",
    timestamps: true,
  }
);

module.exports = Medication;
