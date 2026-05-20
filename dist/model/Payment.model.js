import mongoose, { Schema } from "mongoose";
const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
}, {
    timestamps: true,
});
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
