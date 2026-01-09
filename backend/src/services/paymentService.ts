import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { AppError } from "../middleware/error";
import { verifyRazorpaySignature } from "../utils/payment";
import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });
  }
  return razorpayInstance;
};

export class PaymentService {
  async verifyPayment(data: {
    bookingId: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    const booking = await Booking.findById(data.bookingId);
    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    const isSignatureValid = verifyRazorpaySignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ""
    );

    if (!isSignatureValid) {
      throw new AppError(400, "Invalid payment signature");
    }

    let payment = await Payment.findOne({ razorpayOrderId: data.razorpay_order_id });

    if (!payment) {
      payment = new Payment({
        bookingId: data.bookingId,
        userId: booking.userId,
        razorpayOrderId: data.razorpay_order_id,
        razorpayPaymentId: data.razorpay_payment_id,
        amount: booking.totalAmount,
        currency: booking.currency,
        status: "captured",
        signatureVerified: true,
      });
    } else {
      payment.razorpayPaymentId = data.razorpay_payment_id;
      payment.status = "captured";
      payment.signatureVerified = true;
    }

    await payment.save();

    await Booking.findByIdAndUpdate(
      data.bookingId,
      {
        status: "confirmed",
        razorpayPaymentId: data.razorpay_payment_id,
      },
      { new: true }
    );

    return {
      success: true,
      bookingId: data.bookingId,
      paymentId: payment._id,
    };
  }

  async handleWebhookEvent(event: any) {
    switch (event.event) {
      case "payment.captured":
        return this.handlePaymentCaptured(event.payload.payment.entity);
      case "payment.failed":
        return this.handlePaymentFailed(event.payload.payment.entity);
      case "refund.created":
        return this.handleRefundCreated(event.payload.refund.entity);
      default:
        return { processed: false };
    }
  }

  private async handlePaymentCaptured(paymentEntity: any) {
    const payment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (payment) {
      payment.status = "captured";
      await payment.save();

      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "confirmed" },
        { new: true }
      );
    }

    return { processed: true };
  }

  private async handlePaymentFailed(paymentEntity: any) {
    const payment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (payment) {
      payment.status = "failed";
      await payment.save();

      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "pending" },
        { new: true }
      );
    }

    return { processed: true };
  }

  private async handleRefundCreated(refundEntity: any) {
    const payment = await Payment.findOne({
      razorpayPaymentId: refundEntity.payment_id,
    });

    if (payment) {
      payment.status = "refunded";
      await payment.save();

      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "refunded" },
        { new: true }
      );
    }

    return { processed: true };
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (!payment) {
      throw new AppError(404, "Payment not found");
    }
    return payment;
  }
}
