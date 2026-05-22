import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import PaymentOrder from "./routes/payment.route.js";
import AdminRoute from "./routes/admin.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
/* ---------------------------------------------------
   CORS CONFIG
--------------------------------------------------- */
const allowedOrigins = [
    "http://localhost:3000",
    "https://happyho.in",
    "https://www.happyho.in",
    "https://happy-web-wordpress.vercel.app",
];
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400,
}));
/* ---------------------------------------------------
   COMMON MIDDLEWARE
--------------------------------------------------- */
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
/* ---------------------------------------------------
   HEALTH CHECK
--------------------------------------------------- */
app.get("/", (req, res) => {
    res.json({ status: "ok" });
});
/* ---------------------------------------------------
   API ROUTES
--------------------------------------------------- */
app.use("/api/v1", PaymentOrder);
app.use("/api/v2/admin", AdminRoute);
/* ---------------------------------------------------
   API FALLBACK
--------------------------------------------------- */
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});
/* ---------------------------------------------------
   SERVER START
--------------------------------------------------- */
const connectServer = () => {
    connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port: ${PORT}`);
    });
};
export default connectServer;
function cookieParser() {
    return (req, res, next) => {
        req.cookies = {};
        const cookieHeader = req.headers.cookie;
        if (typeof cookieHeader === "string" && cookieHeader.length > 0) {
            cookieHeader.split(";").forEach((cookie) => {
                const [name, ...valueParts] = cookie.split("=");
                if (!name) {
                    return;
                }
                const value = valueParts.join("=").trim();
                req.cookies[name.trim()] = decodeURIComponent(value);
            });
        }
        next();
    };
}
