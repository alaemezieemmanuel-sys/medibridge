const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Translation = sequelize.define(
  "Translation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    sourceLanguageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    targetLanguageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    translatedText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "translations",
    timestamps: true,
  }
);

module.exports = Translation;