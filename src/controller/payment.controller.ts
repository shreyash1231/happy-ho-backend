import { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

import Booking from "../model/booking.model.js";
import Payment from "../model/Payment.model.js";

import { createOrderSchema } from "../validations/payment.validation.js";

import {
  meditationSessionPricing,
  servicePricing,
  vastuSessionPricing,
} from "../constants/pricing.js";
import razorpay from "../config/razorpay.js";

dotenv.config();

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      // =========================
      // VALIDATE DATA
      // =========================

      const validatedData = createOrderSchema.parse(
        req.body.payload
      );

      let servicePrice: number | undefined;

      // =========================
      // GET PRICE
      // =========================

      if (
        validatedData.selectedService === "Meditation"
      ) {
        servicePrice =
          meditationSessionPricing.get(
            validatedData.session!
          );
      } else if (
        validatedData.selectedService === "Vastu"
      ) {
        servicePrice =
          vastuSessionPricing.get(
            validatedData.session!
          );
      } else {
        servicePrice = servicePricing.get(
          validatedData.selectedService
        );
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
        selectedService:
          validatedData.selectedService,
        selectedGuide:
          validatedData.selectedGuide,
        sessionType:
          validatedData.sessionType,
        concernArea:
          validatedData.concernArea,
      });

      // =========================
      // CREATE RAZORPAY ORDER
      // =========================

      const razorpayOrder =
        await razorpay.orders.create({
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
    } catch (error: any) {
      console.log("Incoming payload:", JSON.stringify(req.body.payload, null, 2));
      console.log("Error name:", error.name);
      console.log("Error message:", error.message);
      console.log("Full error:", error);
      console.log("Error stack:", error.stack);

      return res.status(400).json({
        success: false,
        message:
          error.errors?.[0]?.message ||
          error.message ||
          "Validation failed",
        details: error.errors || error.issues,
      });
    }
  }

  // =========================
  // VERIFY PAYMENT
  // =========================

  async verifyPayment(
    req: Request,
    res: Response
  ) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      // =========================
      // VERIFY SIGNATURE
      // =========================

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET!
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        await Payment.findOneAndUpdate(
          {
            orderId: razorpay_order_id,
          },
          {
            status: "failed",
          }
        );

        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      // =========================
      // UPDATE PAYMENT
      // =========================

      const payment =
        await Payment.findOneAndUpdate(
          {
            orderId: razorpay_order_id,
          },
          {
            paymentId:
              razorpay_payment_id,
            signature:
              razorpay_signature,
            status: "paid",
          },
          {
            new: true,
          }
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Payment verified successfully",
      });
    } catch (error: any) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error",
      });
    }
  }
  // =========================
  // UPDATE BOOKING SLOT (after Calendly selection)
  // =========================

  async updateBookingSlot(
    req: Request,
    res: Response
  ) {
    try {
      const {
        bookingId,
        calendlyEventUri,
        calendlyInviteeUri,
      } = req.body;

      console.log("bookingId: ", bookingId);
      console.log("calendlyEventUri: ", calendlyEventUri);
      console.log("calendlyInviteeUri: ", calendlyInviteeUri);

      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: "bookingId is required",
        });
      }

      let preferredDateTime: Date | null = null;
      console.log("preferredDateTime: ", preferredDateTime);

      // If we have the Calendly event URI, fetch the actual event details
      if (calendlyEventUri) {
        const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
        if (calendlyToken) {
          try {
            const eventResponse = await fetch(calendlyEventUri, {
              headers: {
                Authorization: `Bearer ${calendlyToken}`,
              },
            });
            if (eventResponse.ok) {
              const eventData = (await eventResponse.json()) as any;
              console.log(eventData.resource?.start_time);
              preferredDateTime = new Date(eventData.resource?.start_time);
              console.log("Fetched event start_time from Calendly:", eventData.resource?.start_time);
            } else {
              console.error("Failed to fetch Calendly event:", eventResponse.status);
            }
          } catch (fetchErr) {
            console.error("Error fetching Calendly event:", fetchErr);
          }
        }
      }

      const updateData: any = {};
      if (preferredDateTime) updateData.preferredDateTime = preferredDateTime;
      if (calendlyEventUri) updateData.calendlyEventUri = calendlyEventUri;

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        updateData,
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      console.log("Booking updated:", booking._id, "preferredDateTime:", booking.preferredDateTime);

      return res.status(200).json({
        success: true,
        message: "Booking slot updated successfully",
        data: booking,
      });
    } catch (error: any) {
      console.error("UpdateBookingSlot Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

export default new OrderController();