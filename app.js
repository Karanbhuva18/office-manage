import express from "express";
import sequlize from "./db/db.js";
import routes from "./routes/index.js";
import Payment from "./models/Payment.js";
import Product from "./models/Product.js";
import Sales from "./models/Sales.js";
import User from "./models/User.js";
import Client from "./models/Client.js";
import Expense from "./models/Expense.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

User.hasMany(Payment, { foreignKey: "u_id", as: "payments" });
Payment.belongsTo(User, { foreignKey: "u_id", as: "user" });

Client.hasMany(Payment, { foreignKey: "client_id", as: "payments" });
Payment.belongsTo(Client, { foreignKey: "client_id", as: "client" });

Payment.hasOne(Sales, { foreignKey: "payment_id", as: "sale" });
Sales.belongsTo(Payment, { foreignKey: "payment_id", as: "payment" });

Product.hasMany(Sales, { foreignKey: "product_id", as: "sales" });
Sales.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Client.hasMany(Sales, { foreignKey: "client_id", as: "sales" });
Sales.belongsTo(Client, { foreignKey: "client_id", as: "client" });

User.hasMany(Sales, { foreignKey: "saller_id", as: "sales" });
Sales.belongsTo(User, { foreignKey: "saller_id", as: "saller" });

User.hasMany(Expense, { foreignKey: "creator", as: "created_expenses" });
Expense.belongsTo(User, { foreignKey: "creator", as: "creator_user" });

User.hasMany(Expense, { foreignKey: "paid_user", as: "paid_expenses" });
Expense.belongsTo(User, { foreignKey: "paid_user", as: "paid_user_info" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

app.listen(5000, "0.0.0.0", () => {
  sequlize.sync({ alter: true });
  console.log(`app start in port ${5000}`);
});
