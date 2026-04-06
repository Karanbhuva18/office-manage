import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dept_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true, // adds createdAt & updatedAt
});

export default User;