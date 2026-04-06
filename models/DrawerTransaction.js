import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const DrawerTransaction = sequelize.define(
  "DrawerTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default DrawerTransaction;
