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
        required: true,
    },
    concernArea: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
//# sourceMappingURL=booking.model.js.map