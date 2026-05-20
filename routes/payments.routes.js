import express from "express";
import { createPayment, getPayments } from "../controllers/Payment.controller.js";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", userLoginCheck, userRole(["admin", "manager"]), createPayment);

router.get("/", userLoginCheck, getPayments);

export default router;
