
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthPassport = sequelize.define(
  "HealthPassport",
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
      references: {
        model: "patients",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    bloodGroup: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: {
          args: [
            [
              "A+",
              "A-",
              "B+",
              "B-",
              "AB+",
              "AB-",
              "O+",
              "O-",
            ],
          ],
          msg: "Invalid blood group.",
        },
      },
    },

    genotype: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        isIn: {
          args: [["AA", "AS", "SS", "AC", "SC"]],
          msg: "Invalid genotype.",
        },
      },
    },

    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Height in centimeters.",
      validate: {
        min: {
          args: [0],
          msg: "Height cannot be negative.",
        },
      },
    },

    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Weight in kilograms.",
      validate: {
        min: {
          args: [0],
          msg: "Weight cannot be negative.",
        },
      },
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "health_passports",
    timestamps: true,
  }
);

module.exports = HealthPassport;
