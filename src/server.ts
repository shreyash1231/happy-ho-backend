import express from "express";
import PaymentOrder from "./routes/payment.route.js";
import AdminRoute from "./routes/admin.route.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://happyho.in",
    "https://www.happyho.in",
    "https://happy-web-wordpress.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Handle preflight BEFORE other middleware
app.use(cors(corsOptions));

// ✅ Apply the same config to all routes
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1", PaymentOrder);
app.use("/api/v2/admin", AdminRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});