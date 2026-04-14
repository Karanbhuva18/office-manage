import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, type, paid_by, status, creator, paid_user } =
      req.body;
    if (!title || !amount) {
      return res.status(400).json({ message: "title and amount are required" });
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

export const getExpesneById = async(req,res)=>{
    try{

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}
