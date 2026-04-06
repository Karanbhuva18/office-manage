import userRoute from "../routes/user.routes.js";
import clientRoute from "../routes/client.routes.js";
import express from "express";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/client",clientRoute);

export default routes;
