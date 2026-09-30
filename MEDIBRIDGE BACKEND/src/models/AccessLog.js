const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AccessLog = sequelize.define(
  "AccessLog",
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

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    resourceType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    resourceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    accessedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "access_logs",
    timestamps: false,
  }
);

module.exports = AccessLog;