const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthPassportAccess = sequelize.define(
  "HealthPassportAccess",
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

    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "REVOKED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    grantedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "health_passport_access",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["patientId", "doctorId"],
      },
    ],
  }
);

module.exports = HealthPassportAccess;
