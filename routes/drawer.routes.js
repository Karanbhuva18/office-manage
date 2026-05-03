import {
  getCashDrawer,
  getReimbursement,
  reimbursement,
  updateCashDrawer,
} from "../controllers/drawer.controller.js";
import express from "express";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.get(
  "/reimbursements",
  userLoginCheck,
  userRole(["admin", "manager", "employee"]),
  getReimbursement,
);

routes.post(
  "/reimburse",
  userLoginCheck,
  userRole(["admin", "manager"]),
  reimbursement,
);

routes.put(
  "/updateCashDrawer",
  userLoginCheck,
  userRole(["admin", "manager"]),
  updateCashDrawer,
);

routes.get(
  "/getCashDrawer",
  userLoginCheck,
  userRole(["admin", "manager", "employee"]),
  getCashDrawer,
);

export default routes;
