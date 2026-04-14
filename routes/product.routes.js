import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/Product.controller.js";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";

const routes = express.Router();

// Add routes
routes.post(
  "/createProduct",
  userLoginCheck,
  userRole(["admin", "manager"]),
  createProduct,
);
routes.get("/getProduct", userLoginCheck, getAllProduct);
routes.put("/update/:id", userLoginCheck, updateProduct);
routes.delete("/delete/:id", userLoginCheck, deleteProduct);
// routes.post("/login",loginUser);
export default routes;
