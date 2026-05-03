import {
  createExpense,
  getExpesnes,
} from "../controllers/expense.controller.js";
import express from "express";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post(
  "/createExpense",
  userLoginCheck,
  userRole(["admin", "manager"]),
  createExpense,
);

routes.get(
  "/getExpense",
  userLoginCheck,
  userRole(["admin", "manager", "employee"]),
  getExpesnes,
);

export default routes;
