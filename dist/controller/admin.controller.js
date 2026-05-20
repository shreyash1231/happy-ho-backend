// controllers/admin.controller.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.model.js";
import dotenv from "dotenv";
import Payment from "../model/Payment.model.js";
import Booking from "../model/booking.model.js";
dotenv.config();
class AdminController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            // validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }
            // check existing admin
            //   const existingAdmin = await User.findOne({ email });
            //   if (existingAdmin) {
            //     return res.status(400).json({
            //       success: false,
            //       message: "Admin already exists",
            //     });
            //   }
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // create admin
            const admin = await User.create({
                email,
                password: hashedPassword,
                role: "admin",
            });
            return res.status(201).json({
                success: true,
                message: "Admin created successfully",
                data: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role,
                },
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }
            // find admin
            const admin = await User.findOne({ email });
            if (!admin) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            // compare password
            const isPasswordMatched = await bcrypt.compare(password, admin.password);
            if (!isPasswordMatched) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            // create jwt token
            const token = jwt.sign({
                id: admin._id,
                role: admin.role,
            }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            // store token in cookie
            res.cookie("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                data: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role,
                },
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    static async getAllBookings(req, res) {
        try {
            const bookings = await Booking.find()
                .select("-concernArea")
                .sort({ createdAt: -1 })
                .lean();
            const bookingIds = bookings.map((b) => b._id);
            const payments = await Payment.find({ userId: { $in: bookingIds } })
                .select("userId status") // only status
                .lean();
            const paymentMap = new Map(payments.map((p) => [p.userId.toString(), p.status]));
            const data = bookings.map((booking) => ({
                ...booking,
                paymentStatus: paymentMap.get(booking._id.toString()) ?? null,
            }));
            return res.status(200).json({
                success: true,
                count: data.length,
                data,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
    static async getBookingById(req, res) {
        try {
            const booking = await Booking.findById(req.params.id).lean();
            if (!booking) {
                return res.status(404).json({ success: false, message: "Booking not found" });
            }
            const payment = await Payment.findOne({ userId: booking._id })
                .select("orderId paymentId status amount createdAt") // all relevant fields
                .lean();
            return res.status(200).json({
                success: true,
                data: {
                    ...booking,
                    payment: payment
                        ? {
                            paymentId: payment.paymentId ?? null,
                            status: payment.status,
                            amount: payment.amount,
                            paidAt: payment.createdAt,
                        }
                        : null,
                },
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}
export default AdminController;
//# sourceMappingURL=admin.controller.js.map