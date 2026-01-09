import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth";
import { Booking } from "../models/Booking";
import { Payment } from "../models/Payment";
import { Conversation } from "../models/Conversation";
import { AppError } from "../middleware/error";
import Razorpay from "razorpay";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

router.use(authMiddleware, adminMiddleware);

router.get("/bookings", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate("userId eventId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ items: bookings, total, page, limit });
  } catch (error) {
    next(error);
  }
});

router.get("/payments", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const skip = (page - 1) * limit;

    const total = await Payment.countDocuments();
    const payments = await Payment.find()
      .populate("bookingId userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ items: payments, total, page, limit });
  } catch (error) {
    next(error);
  }
});

router.get("/conversations", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const skip = (page - 1) * limit;
    const query = req.query.q ? { $or: [{ "messages.text": { $regex: req.query.q, $options: "i" } }] } : {};

    const total = await Conversation.countDocuments(query);
    const conversations = await Conversation.find(query)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ items: conversations, total, page, limit });
  } catch (error) {
    next(error);
  }
});

router.post("/refund", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId, amount } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment || !payment.razorpayPaymentId) {
      throw new AppError(404, "Payment not found");
    }

    const refundResponse = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: amount ? amount * 100 : undefined,
    });

    payment.status = "refunded";
    await payment.save();

    const booking = await Booking.findByIdAndUpdate(
      payment.bookingId,
      { status: "refunded" },
      { new: true }
    );

    res.json({
      refund_id: refundResponse.id,
      status: refundResponse.status,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "captured" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      total_bookings: totalBookings,
      confirmed_bookings: confirmedBookings,
      total_revenue: totalRevenue[0]?.total || 0,
      pending_bookings: totalBookings - confirmedBookings,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
