const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AIConversation = sequelize.define(
  "AIConversation",
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
  },
  {
    tableName: "ai_conversations",
    timestamps: true,
  }
);

module.exports = AIConversation;