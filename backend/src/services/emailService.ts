import nodemailer from "nodemailer";
import { logger } from "./loggerService";

class EmailService {
  private transporter: any;

  constructor() {
    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendBookingConfirmation(
    email: string,
    bookingId: string,
    eventName: string,
    totalAmount: number
  ) {
    try {
      const htmlContent = `
        <h2>Booking Confirmed!</h2>
        <p>Your booking has been confirmed.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>Check your bookings to download your ticket.</p>
      `;

      await this.send(email, "Booking Confirmation - Prasthanam", htmlContent);
      logger.info("Booking confirmation email sent", { email, bookingId });
    } catch (error) {
      logger.error("Failed to send booking confirmation email", { email, error });
    }
  }

  async sendRefundNotification(
    email: string,
    bookingId: string,
    refundAmount: number
  ) {
    try {
      const htmlContent = `
        <h2>Refund Processed</h2>
        <p>Your refund has been processed successfully.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
        <p>The amount will be credited to your original payment method within 3-5 business days.</p>
      `;

      await this.send(email, "Refund Processed - Prasthanam", htmlContent);
      logger.info("Refund notification email sent", { email, bookingId });
    } catch (error) {
      logger.error("Failed to send refund notification email", { email, error });
    }
  }

  async send(to: string, subject: string, htmlContent: string) {
    if (!this.transporter) {
      logger.warn("Email service not configured, skipping email send");
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
