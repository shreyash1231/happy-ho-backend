import express from "express";
import paymentController from "../controller/payment.controller.js";
import { paymentRateLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();
// CREATE ORDER — unchanged route, same rate limiter
router.post("/payment/create-order", paymentRateLimiter, paymentController.createOrder);
// VERIFY — replaces /payment/success
// Frontend calls this after Razorpay checkout handler fires
router.post("/payment/verify", paymentRateLimiter, paymentController.verifyPayment);
export default router;
//# sourceMappingURL=payment.route.js.map