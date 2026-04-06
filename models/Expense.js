import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paid_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    paid_user:{
        type:DataTypes.INTEGER
    }
  },
  {
    timestamps: true,
  },
);

export default Expense;
