const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full name is required",
        },
        len: {
          args: [2, 100],
          msg: "Full name must be between 2 and 100 characters",
        },
      },
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      set(value) {
    this.setDataValue(
      "email",
      value.trim().toLowerCase()
    );
  },
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be at least 8 characters",
        },
      },
    },

    role: {
      type: DataTypes.ENUM("PATIENT", "DOCTOR", "ADMIN"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "SUSPENDED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "users",

    timestamps: true,

    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      },

      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;