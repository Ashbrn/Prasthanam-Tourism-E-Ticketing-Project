import { Booking } from "../models/Booking";
import { Event } from "../models/Event";
import { AppError } from "../middleware/error";
import { calculatePricing } from "../utils/payment";
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

export class BookingService {
  async createBookingDraft(data: any) {
    const event = await Event.findById(data.eventId);
    if (!event) {
      throw new AppError(404, "Event not found");
    }

    const ticketTypesMap = new Map(event.ticketTypes.map((t) => [t.id, t]));
    const ticketsWithPricing = data.tickets.map((ticket: any) => {
      const ticketType = ticketTypesMap.get(ticket.typeId);
      if (!ticketType) {
        throw new AppError(400, `Invalid ticket type: ${ticket.typeId}`);
      }
      return {
        typeId: ticket.typeId,
        qty: ticket.qty,
        unitPrice: ticketType.price,
        taxPercent: ticketType.taxPercent,
      };
    });

    const pricing = calculatePricing(ticketsWithPricing);
    const amountInPaise = Math.round(pricing.total * 100);

    const razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: data.currency || "INR",
      receipt: `booking-${Date.now()}`,
      payment_capture: true,
    }) as any;

    const booking = new Booking({
      userId: data.userId,
      eventId: data.eventId,
      scheduleDate: data.scheduleDate,
      tickets: ticketsWithPricing,
      totalAmount: pricing.total,
      currency: data.currency || "INR",
      razorpayOrderId: razorpayOrder.id,
      contact: data.contact,
      status: "pending",
    });

    await booking.save();

    return {
      bookingId: booking._id,
      summary: {
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        total: pricing.total,
        currency: booking.currency,
      },
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: amountInPaise,
        currency: razorpayOrder.currency,
      },
    };
  }

  async getBookingById(id: string) {
    const booking = await Booking.findById(id).populate("eventId");
    if (!booking) {
      throw new AppError(404, "Booking not found");
    }
    return booking;
  }

  async getUserBookings(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments({ userId });
    const bookings = await Booking.find({ userId })
      .populate("eventId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      items: bookings,
      total,
      page,
      limit,
    };
  }

  async cancelBooking(bookingId: string) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) {
      throw new AppError(404, "Booking not found");
    }
    return booking;
  }
}
