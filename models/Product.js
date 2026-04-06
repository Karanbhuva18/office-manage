import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dept_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Product;
