import Expense from "../models/Expense.js";
import Transaction from "../models/Transaction.js";
import {
  calculateRemainingCurrency,
  calculateTotal,
} from "../utils/constant.js";

export const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      paid_by,
      status,
      creator,
      paid_user,
      currency,
    } = req.body;
    if (!title || !amount || !paid_by) {
      return res
        .status(400)
        .json({ message: "title, amount, and paid_by are required" });
    }
    if (paid_by === "cash") {
      const drawerAmount = await CashDrawer.findOne();
      if (!drawerAmount || drawerAmount.amount < amount) {
        return res.status(400).json({ message: "Insufficient cash in drawer" });
      }
      if (!currency || typeof currency !== "object") {
        return res.status(400).json({ message: "currency must be object" });
      }
      const remainingCurrency = calculateRemainingCurrency(
        currency,
        drawerAmount.currency,
      );
      const updatedAmount = calculateTotal(remainingCurrency);
      drawerAmount.amount = updatedAmount;
      drawerAmount.currency = remainingCurrency;
      await drawerAmount.save();
      if (!currency || typeof currency !== "object") {
        return res.status(400).json({ message: "currency must be object" });
      }
      await Transaction.create({
        type: "EXPENSE",
        description: "Cash Removed for Expense",
        amount: amount,
        currency: currency,
      });
    }
    const createExpense = await Expense.create({
      title,
      amount,
      type,
      paid_by,
      status,
      creator,
      paid_user,
    });

    return res.status(201).json({
      message: "Expense created successfully",
      data: createExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getExpesnes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows: expenses } = await Expense.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    const currentPage = parseInt(page);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    return res.status(200).json({
      message: "Expenses retrieved successfully",
      data: expenses,
      total: count,
      totalPages,
      currentPage,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

