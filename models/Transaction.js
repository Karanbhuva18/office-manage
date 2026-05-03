import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM("ADD_CASH", "EXPENSE"),
  },
  description: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.INTEGER,
  },
  currency: {
    type: DataTypes.JSON,
  },
},{timestamps: true});

export default Transaction;