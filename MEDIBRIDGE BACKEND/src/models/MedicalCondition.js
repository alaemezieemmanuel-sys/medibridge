const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MedicalCondition = sequelize.define(
  "MedicalCondition",
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
          msg: "Medical condition name is required.",
        },
      },
    },

    diagnosedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "RESOLVED", "MANAGED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "medical_conditions",
    timestamps: true,
  }
);

module.exports = MedicalCondition;
