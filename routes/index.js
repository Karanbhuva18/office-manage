import userRoute from "../routes/user.routes.js";
import clientRoute from "../routes/client.routes.js";
import ProductRoute from "../routes/product.routes.js";
import express from "express";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/client",clientRoute);
routes.use("/product",ProductRoute);

export default routes;
