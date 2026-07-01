import express from "express";
import PaymentOrder from "./routes/payment.route.js";
import AdminRoute from "./routes/admin.route.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://happyho.in",
        "https://www.happyho.in",
        "https://happy-web-wordpress.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1/", PaymentOrder);
app.use("/api/v2/admin", AdminRoute);
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
