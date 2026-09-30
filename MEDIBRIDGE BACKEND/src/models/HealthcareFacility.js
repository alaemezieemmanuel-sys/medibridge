const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthcareFacility = sequelize.define(
  "HealthcareFacility",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "healthcare_facilities",
    timestamps: true,
  }
);

module.exports = HealthcareFacility;