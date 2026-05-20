import Sales from "../models/Sales.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import { col } from "sequelize";
import Client from "../models/Client.js";

export const createSales = async (req, res) => {
  try {
    const { clientId, productId, amount, sallerId, paymentType } = req.body;

    const user = req.user;

    console.log("Request Body:", req.body);

    if (!clientId || !productId) {
      return res.status(400).json({
        message: "client_id and product_id are required",
      });
    }

    const findProduct = await Product.findOne({
      where: { id: productId },
    });

    if (!findProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const paymentStatus =
      parseInt(findProduct.Price) > amount ? "pending" : "paid";
    // PREPAID

    const createPayment = await Payment.create({
      type: paymentType,
      status: paymentStatus,
      u_id: user.id ?? sallerId,
      client_id: clientId,
      total: amount,
    });

    const createSales = await Sales.create({
      client_id: clientId,
      product_id: productId,
      total: amount,
      saller_id: user.id ?? sallerId,
      payment_id: createPayment.id,
      sale_date: new Date(),
      status: paymentStatus,
      type: paymentType, // important
    });

    await createPayment.update({
      sale_id: createSales.id,
    });

    console.log("createSales", createSales);

    return res.status(201).json({
      message: "Sales created successfully with prepaid payment",
      data: createSales,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: sales } = await Sales.findAndCountAll({
      attributes: [
        "id",
        [col("product.name"), "productName"],
        [col("client.name"), "clientName"],
        "total",
        [col("payment.type"), "type"],
        [col("payment.status"), "status"],
        "sale_date",
      ],

      include: [
        {
          model: Product,
          attributes: [],
          as: "product",
        },
        {
          model: Payment,
          attributes: [],
          as: "payment",
          required: status ? true : false,
          where: status ? { status } : undefined,
        },
        {
          model: Client,
          attributes: [],
          as: "client",
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
    return res.status(500).json({
      message: error.message,
    });
  }
};
