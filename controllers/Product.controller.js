import { Op } from "sequelize";
import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, tax, description, dept_id } = req.body;
    console.log("price", price);
    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" });
    }
    const existingProduct = await Product.findOne({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({ message: "product already existing" });
    }

    const createProduct = await Product.create({
      name,
      Price: price,
      tax,
      description,
      dept_id,
    });
    return res
      .status(200)
      .json({ message: "product created sucessfully", data: createProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    let { page = 1, limit = 5, product } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offSet = (page - 1) * limit;
    let whereClause = {};
    if (product) {
      whereClause.name = {
        [Op.like]: `%${product}%`,
      };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      offset: offSet,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPage = Math.ceil(count / limit);
    const hasNextPage = totalPage > page;
    const hasPrevPage = totalPage < page;

    return res.status(200).json({
      message: "Product Data",
      data: rows,
      totalPage,
      hasNextPage,
      hasPrevPage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, tax, dept_id, description } = req.body;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "provide proper id" });
    }

    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(400).json({ message: "product not availabel" });
    }

    await product.update({ name, Price: price, tax, dept_id, description });
    return res.status(200).json({ message: "Product Updated", data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const deletedRows = await Product.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
