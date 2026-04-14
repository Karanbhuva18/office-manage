import { col } from "sequelize";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import Sales from "../models/Sales.js";
import Client from "../models/Client.js";

export const createPayment = async (req, res) => {
  try {
    const { sale_id, amount, client_id } = req.body;
    if (!sale_id || !amount) {
      return res
        .status(400)
        .json({ message: "sale_id and amount are required" });
    }

    const findSales = await Sales.findOne({
      where: { id: sale_id },
      attributes: ["id", "client_id", [col("product.price"), "productPrice"]],
      include: [
        {
          model: Product,
          attributes: [],
        },
      ],
      raw: true,
    });
    if (!findSales) {
      return res.status(404).json({ message: "Sales not found" });
    }

    const createPayment = await Payment.create({
      sale_id,
      total: amount,
      type: "postpaid",
      status: findSales.productPrice > amount ? "pending" : "paid",
      client_id: findSales.client_id,
    });
    return res.status(201).json({
      message: "Payment created successfully",
      data: createPayment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows: payments } = await Payment.findAndCountAll({
      offset,
      limit: parseInt(limit),
      attributes: [
        "id",
        "type",
        "status",
        [col("client.name"), "clientName"],
        [col("sale.id"), "saleId"],
        ["total", "paidAmount"],
        [col("sale.product.price"), "total"],
        [literal("sale.product.price - Payment.total"), "remianing"],
      ],
      include: [
        {
          model: Client,
          attributes: [],
        },
        {
          model: Sales,
          as: "sale",
          attributes: [],
          include: [
            {
              model: Product,
              as: "product",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
      subQuery: false,
    });
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return res.status(200).json({
      message: "Payments retrieved successfully",
      data: payments,
      total: count,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
