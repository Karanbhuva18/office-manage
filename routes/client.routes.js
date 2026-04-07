import { createClient, deleteClients, showClients, updateClients } from "../controllers/client.controller.js";
import express from "express";
import { userLoginCheck, userRole } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post("/createClient", userLoginCheck, userRole(["admin"]), createClient);
routes.get("/getClient", userLoginCheck, showClients);
routes.put("/update/:id", userLoginCheck, updateClients);
routes.delete("/delete/:id",userLoginCheck,deleteClients);

export default routes;
