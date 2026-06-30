// models/Booking.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedService: string;
  selectedGuide: string;
  sessionType: "Online" | "Offline";
  preferredDateTime?: Date;
  calBookingUid?: string;
  concernArea: string;

  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
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
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);

export default Booking;