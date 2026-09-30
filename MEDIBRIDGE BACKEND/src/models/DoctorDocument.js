const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DoctorDocument = sequelize.define(
  "DoctorDocument",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    documentType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    verificationStatus: {
      type: DataTypes.ENUM(
        "PENDING",
        "VERIFIED",
        "REJECTED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "doctor_documents",
    timestamps: true,
  }
);

module.exports = DoctorDocument;