const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthAccessGrant = sequelize.define(
  "HealthAccessGrant",
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

    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "REVOKED", "EXPIRED"),
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

    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "health_access_grants",
    timestamps: true,
  }
);

module.exports = HealthAccessGrant;