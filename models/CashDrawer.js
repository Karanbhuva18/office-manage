import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const CashDrawer = sequelize.define(
  "CashDrawer",
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
    currency: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default CashDrawer;
