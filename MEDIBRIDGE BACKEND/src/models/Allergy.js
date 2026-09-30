const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Allergy = sequelize.define(
  "Allergy",
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

    allergen: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Allergen is required.",
        },
      },
    },

    reaction: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    severity: {
      type: DataTypes.ENUM("MILD", "MODERATE", "SEVERE"),
      allowNull: false,
      defaultValue: "MODERATE",
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "allergies",
    timestamps: true,
  }
);

module.exports = Allergy;
