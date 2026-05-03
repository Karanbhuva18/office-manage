import userRoute from "../routes/user.routes.js";
import clientRoute from "../routes/client.routes.js";
import ProductRoute from "../routes/product.routes.js";
import CashDrawer from "../routes/drawer.routes.js";
import expenseRoute from "../routes/expense.routes.js";
import SaleRoute from "../routes/sales.routes.js";
import express from "express";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/cashDrawer", CashDrawer);
routes.use("/expense", expenseRoute);
routes.use("/client", clientRoute);
routes.use("/product", ProductRoute);
routes.use("/sale",SaleRoute)

export default routes;
