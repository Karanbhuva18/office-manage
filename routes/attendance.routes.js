import express from "express";
import { getAttendance, markAttendance } from "../controllers/User.controller.js";
import { userLoginCheck } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post("/check-in", userLoginCheck, markAttendance);
routes.get("/get-attendance", userLoginCheck, getAttendance);

export default routes;
