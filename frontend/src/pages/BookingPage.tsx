import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import { useBookingStore } from "../store/bookingStore";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId, selectedDate, selectedTickets, contactInfo, setCurrentBooking, clearBooking, setContactInfo } = useBookingStore();
  const { user, isLoggedIn } = useAuthStore();
  const [name, setName] = useState(contactInfo?.name || "");
  const [email, setEmail] = useState(contactInfo?.email || user?.email || "");
  const [phone, setPhone] = useState(contactInfo?.phone || user?.phone || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId || !selectedDate) {
      navigate("/events");
    }
  }, [eventId, selectedDate, navigate]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setContactInfo({ name, email, phone });

      const ticketArray = Object.entries(selectedTickets)
        .filter(([, qty]) => qty > 0)
        .map(([typeId, qty]) => ({ typeId, qty }));

      const response = await apiClient.post("/bookings/create", {
        userId: isLoggedIn ? user?._id : null,
        eventId,
        scheduleDate: selectedDate,
        tickets: ticketArray,
        contact: { name, email, phone },
        currency: "INR",
      });

      const { bookingId, summary, razorpayOrder } = response.data;
      setCurrentBooking(response.data);

      initiateRazorpayPayment(bookingId, razorpayOrder, summary);
    } catch (error) {
      console.error("Booking failed:", error);
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = (bookingId: string, razorpayOrder: any, summary: any) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Prasthanam",
        description: "Tourism E-Ticketing",
        prefill: { name, email, contact: phone },
        theme: { color: "#6366f1" },
        handler: async (response: any) => {
          try {
            const verifyResponse = await apiClient.post("/payments/verify", {
              bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert(t("payment_success"));
            clearBooking();
            navigate(`/bookings`);
          } catch (error) {
            alert(t("payment_failed"));
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };

  return (
    <>
      <Header />
      <main className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t("proceed_to_payment")}</h1>

        <form onSubmit={handleConfirmBooking} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">{t("contact")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t("name")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("phone")}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? t("loading") : t("proceed_to_payment")}
          </button>
        </form>
      </main>
    </>
  );
}
