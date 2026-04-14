import Sales from "../models/Sales.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import { col } from "sequelize";
import Client from "../models/Client.js";
export const createSales = async (req, res) => {
  try {
    const { client_id, product_id, amount, saller_id, paymentType, status } =
      req.body;
    if (!client_id || !product_id) {
      return res
        .status(400)
        .json({ message: "client_id and product_id are required" });
    }
    const findProduct = await Product.findOne({ where: { id: product_id } });
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (paymentType && paymentType === "prepaid") {
      const createPayment = await Payment.create({
        type: paymentType,
        status: findProduct.price > amount ? "pending" : "paid",
        u_id: saller_id,
        client_id,
        total: amount,
      });

      const createSales = await Sales.create({
        client_id,
        product_id,
        amount,
        saller_id,
        payment_id: createPayment.id,
        sale_date: new Date(),
      });

      await createPayment.update({
        status: findProduct.price > amount ? "pending" : "paid",
        sale_id: createSales.id,
      });

      return res.status(201).json({
        message: "Sales created successfully with prepaid payment",
        data: createSales,
      });
    } else {
      const createSales = await Sales.create({
        client_id,
        product_id,
        amount,
        saller_id,
        sale_date: new Date(),
      });
      return res.status(201).json({
        message: "Sales created successfully without payment",
        data: createSales,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = status ? { status } : {};
    const { count, rows: sales } = await Sales.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        [col("product.name"), "productName"],
        [col("client.name"), "clientName"],
        "amount",
        [col("payment.type"), "type"],
        [col("payment.status"), "status"],
        "sale_date",
      ],
      include: [
        {
          model: Product,
          attributes: [],
        },
        {
          model: Payment,
          attributes: [],
        },
        {
          model: Client,
          attributes: [],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true,
    });
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return res.status(200).json({
      message: "Sales retrieved successfully",
      data: {
        sales,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
