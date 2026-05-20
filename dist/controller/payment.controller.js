import crypto from "crypto";
import dotenv from "dotenv";
import Booking from "../model/booking.model.js";
import Payment from "../model/Payment.model.js";
import { createOrderSchema } from "../validations/payment.validation.js";
import { meditationSessionPricing, servicePricing, vastuSessionPricing, } from "../constants/pricing.js";
import razorpay from "../config/razorpay.js";
dotenv.config();
class OrderController {
    async createOrder(req, res) {
        try {
            // =========================
            // VALIDATE DATA
            // =========================
            const validatedData = createOrderSchema.parse(req.body.payload);
            let servicePrice;
            // =========================
            // GET PRICE
            // =========================
            if (validatedData.selectedService === "Meditation") {
                servicePrice =
                    meditationSessionPricing.get(validatedData.session);
            }
            else if (validatedData.selectedService === "Vastu") {
                servicePrice =
                    vastuSessionPricing.get(validatedData.session);
            }
            else {
                servicePrice = servicePricing.get(validatedData.selectedService);
            }
            if (!servicePrice) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid service selected",
                });
            }
            // =========================
            // CREATE BOOKING
            // =========================
            const booking = await Booking.create({
                fullName: validatedData.fullName,
                email: validatedData.email,
                phoneNumber: validatedData.phoneNumber,
                selectedService: validatedData.selectedService,
                selectedGuide: validatedData.selectedGuide,
                sessionType: validatedData.sessionType,
                preferredDateTime: validatedData.preferredDateTime,
                concernArea: validatedData.concernArea,
            });
            // =========================
            // CREATE RAZORPAY ORDER
            // =========================
            const razorpayOrder = await razorpay.orders.create({
                amount: servicePrice * 100, // paise
                currency: "INR",
                receipt: `receipt_${booking._id}`,
            });
            // =========================
            // SAVE PAYMENT
            // =========================
            await Payment.create({
                userId: booking._id,
                orderId: razorpayOrder.id,
                amount: servicePrice,
                status: "pending",
            });
            // =========================
            // RESPONSE
            // =========================
            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: {
                    bookingId: booking._id,
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    key: process.env.RAZORPAY_KEY_ID,
                },
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: error.errors?.[0]?.message ||
                    error.message ||
                    "Validation failed",
            });
        }
    }
    // =========================
    // VERIFY PAYMENT
    // =========================
    async verifyPayment(req, res) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
            // =========================
            // VERIFY SIGNATURE
            // =========================
            const generatedSignature = crypto
                .createHmac("sha256", process.env
                .RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");
            if (generatedSignature !==
                razorpay_signature) {
                await Payment.findOneAndUpdate({
                    orderId: razorpay_order_id,
                }, {
                    status: "failed",
                });
                return res.status(400).json({
                    success: false,
                    message: "Payment verification failed",
                });
            }
            // =========================
            // UPDATE PAYMENT
            // =========================
            const payment = await Payment.findOneAndUpdate({
                orderId: razorpay_order_id,
            }, {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: "paid",
            }, {
                new: true,
            });
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message ||
                    "Internal server error",
            });
        }
    }
}
export default new OrderController();
//# sourceMappingURL=payment.controller.js.map