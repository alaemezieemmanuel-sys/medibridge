const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "languages",
    timestamps: true,
  }
);

module.exports = Language;