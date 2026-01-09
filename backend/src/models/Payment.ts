import mongoose, { Schema, Document } from "mongoose";
import { IPayment } from "../types";

export interface IPaymentDocument extends Omit<IPayment, '_id'>, Document {}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    bookingId: { type: "ObjectId", ref: "Booking", required: true },
    userId: { type: "ObjectId", ref: "User" },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
    method: { type: String },
    signatureVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });

export const Payment = mongoose.model<IPaymentDocument>("Payment", paymentSchema);
