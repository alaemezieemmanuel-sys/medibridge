const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AIMessage = sequelize.define(
  "AIMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    senderType: {
      type: DataTypes.ENUM("PATIENT", "AI"),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "ai_messages",
    timestamps: true,
  }
);

module.exports = AIMessage;