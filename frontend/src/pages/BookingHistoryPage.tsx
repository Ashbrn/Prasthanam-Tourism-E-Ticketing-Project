import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import { Booking } from "../types";
import Header from "../components/Header";

export default function BookingHistoryPage() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get("/bookings");
      setBookings(response.data.items);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      confirmed: "badge-success",
      pending: "badge-warning",
      cancelled: "badge-error",
      refunded: "badge-warning",
    }[status] || "badge-primary";

    return <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-8">{t("loading")}</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{t("bookings")}</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-600">{t("no_bookings")}</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-bold">Booking #{booking._id?.slice(-6)}</p>
                    <p className="text-gray-600">Date: {booking.scheduleDate}</p>
                    <p className="text-gray-600">
                      Total: ₹{booking.totalAmount} {booking.currency}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Tickets:</p>
                      {booking.tickets.map((t) => (
                        <p key={t.typeId} className="text-sm text-gray-600">
                          {t.typeId}: {t.qty} x ₹{t.unitPrice}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => {
                          const qrCanvas = document.createElement("canvas");
                          alert("Download ticket (QR code feature)");
                        }}
                        className="block mt-4 btn-primary text-sm px-3 py-1"
                      >
                        {t("download_ticket")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
