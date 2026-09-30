const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    consultationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "consultations",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Message cannot be empty.",
        },
        len: {
          args: [1, 2000],
          msg: "Message must be between 1 and 2000 characters.",
        },
      },
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);

module.exports = Message;