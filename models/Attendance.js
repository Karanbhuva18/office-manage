import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    u_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_in: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    check_out: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_hours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Attendance;
