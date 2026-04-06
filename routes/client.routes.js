import { createClient } from "../controllers/client.controller.js";
import express from "express";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post("/createClient",userLoginCheck,userRole(['admin']), createClient);

export default routes;
