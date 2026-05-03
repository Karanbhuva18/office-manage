import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Sales = sequelize.define(
  "Sales",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    saller_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sale_date:{
        type:DataTypes.DATE,
        allowNull:true
    }
  },
  {
    timestamps: true,
  },
);

export default Sales;
