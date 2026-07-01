// models/Booking.ts
import mongoose, { Schema } from "mongoose";
const bookingSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    selectedService: {
        type: String,
        required: true,
    },
    selectedGuide: {
        type: String,
        required: true,
    },
    sessionType: {
        type: String,
        enum: ["Online", "Offline"],
        required: true,
    },
    preferredDateTime: {
        type: Date,
        required: false,
    },
    calBookingUid: {
        type: String,
        required: false,
    },
    concernArea: {
        type: String,
        trim: true,
        default: "", // Optional field with default empty string
    },
}, {
    timestamps: true,
});
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
