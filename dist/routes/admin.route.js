import express from "express";
import AdminController from "../controller/admin.controller.js";
import { adminAuthMiddleware } from "../middleware/AdminauthMiddleware.js";
const router = express.Router();
// Public routes
router.post("/register", AdminController.register);
router.post("/login", AdminController.login);
// Protected routes
router.get("/bookings", adminAuthMiddleware, AdminController.getAllBookings);
router.get("/getbookingdatabyid/:id", adminAuthMiddleware, AdminController.getBookingById);
export default router;
