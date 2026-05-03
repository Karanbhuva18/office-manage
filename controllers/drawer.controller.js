import CashDrawer from "../models/CashDrawer.js";
import { calculateTotal, mergeCurrency } from "../utils/constant.js";
import Transaction from "../models/Transaction.js";
import Expense from "../models/Expense.js";
import { col } from "sequelize";

export const updateCashDrawer = async (req, res) => {
  try {
    const { currency } = req.body;

    if (!currency || typeof currency !== "object") {
      return res.status(400).json({ message: "currency must be object" });
    }

    const totalAmount = calculateTotal(currency);

    await Transaction.create({
      type: "ADD_CASH",
      description: "Cash added",
      amount: totalAmount,
      currency,
    });

    let drawer = await CashDrawer.findOne();

    if (!drawer) {
      drawer = await CashDrawer.create({
        amount: totalAmount,
        currency,
      });
    } else {
      const oldCurrency = drawer.currency || {};

      const updatedCurrency = mergeCurrency(oldCurrency, currency);
      const updatedAmount = calculateTotal(updatedCurrency);

      await drawer.update({
        amount: updatedAmount,
        currency: updatedCurrency,
      });
    }

    return res.status(200).json({
      message: "Cash drawer updated",
      data: drawer,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCashDrawer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const transactions = await Transaction.findAndCountAll({
      order: [["createdAt", "DESC"]],
      offset,
      limit: parseInt(limit),
    });
    const totalPages = Math.ceil(transactions.count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const drawer = await CashDrawer.findOne();
    return res.status(200).json({
      message: "Cash drawer retrieved",
      data: drawer,
      transactions: transactions.rows,
      total: transactions.count,
      totalPages,
      currentPage: parseInt(page),
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reimbursement = async (req, res) => {
  try {
    const { description, currency } = req.body;
    const paid_user = req.user.id;

    if (!currency || typeof currency !== "object") {
      return res.status(400).json({ message: "currency must be object" });
    }

    let drawer = await CashDrawer.findOne();
    if (!drawer) {
      return res.status(400).json({ message: "Cash drawer not found" });
    }
    const oldCurrency = drawer.currency || {};
    const totalAmount = calculateTotal(currency);
    const remainingCurrency = calculateRemainingCurrency(
      currency,
      drawerAmount.currency,
    );
    const updatedAmount = calculateTotal(remainingCurrency);

    await drawer.update({
      amount: updatedAmount,
      currency: remainingCurrency,
    });
    await Transaction.create({
      type: "EXPENSE",
      description: "Cash removed for reimbursement",
      amount: totalAmount,
      currency,
    });

    const findExpense = await Expense.findOne({
      where: { paid_user },
    });

    if (findExpense) {
      await findExpense.update({
        status: "paid",
      });
    }

    return res.status(200).json({
      message: "Reimbursement successful",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReimbursement = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const getUserExpenses = await Expense.findAndCountAll({
      attributes: [
        "id",
        "title",
        "amount",
        "status",
        "createdAt",
        [col("paid_user_info.name"), "paid_user_name"],
      ],
      include: [
        {
          model: User,
          as: "paid_user_info",
          attributes: [],
        },
      ],
    });
    const totalPages = Math.ceil(getUserExpenses.count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return res.status(200).json({
      message: "User reimbursements retrieved",
      data: getUserExpenses.rows,
      total: getUserExpenses.count,
      totalPages,
      currentPage: parseInt(page),
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
