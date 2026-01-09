import mongoose, { Schema, Document } from "mongoose";
import { IBooking } from "../types";

export interface IBookingDocument extends Omit<IBooking, '_id'>, Document {}

const bookingSchema = new Schema<IBookingDocument>(
  {
    userId: { type: "ObjectId", ref: "User" },
    eventId: { type: "ObjectId", ref: "Event", required: true },
    scheduleDate: { type: String, required: true },
    tickets: [
      {
        typeId: { type: String, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refunded"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    contact: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ razorpayOrderId: 1 });

export const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
