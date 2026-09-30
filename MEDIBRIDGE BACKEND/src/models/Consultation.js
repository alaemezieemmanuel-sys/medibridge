const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Consultation = sequelize.define(
  "Consultation",
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

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Reason for consultation is required.",
        },
      },
    },

    symptoms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "REQUESTED",
        "PAID",
        "SCHEDULED",
        "COMPLETED",
        "DECLINED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "REQUESTED",
    },

    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID"),
      allowNull: false,
      defaultValue: "UNPAID",
    },

    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
requestedAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
},
    doctorNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    referral: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "consultations",
    timestamps: true,
  }
);

module.exports = Consultation;
