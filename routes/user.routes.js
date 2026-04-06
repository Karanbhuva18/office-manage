import { createUser, loginUser } from "../controllers/User.controller.js";
import express from "express";

const routes = express.Router();

// Add routes
routes.post("/create", createUser);
routes.post("/login",loginUser);
export default routes;
