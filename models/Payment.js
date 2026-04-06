import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Payment;
