import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import Header from "../components/Header";

interface Stats {
  total_bookings: number;
  confirmed_bookings: number;
  total_revenue: number;
  pending_bookings: number;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes, paymentsRes] = await Promise.all([
        apiClient.get("/admin/stats"),
        apiClient.get("/admin/bookings?limit=10"),
        apiClient.get("/admin/payments?limit=10"),
      ]);

      setStats(statsRes.data);
      setBookings(bookingsRes.data.items);
      setPayments(paymentsRes.data.items);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold mb-8">{t("dashboard")}</h1>

        {tab === "stats" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-gray-600 text-sm">{t("total_bookings")}</p>
              <p className="text-3xl font-bold">{stats.total_bookings}</p>
            </div>
            <div className="card">
              <p className="text-gray-600 text-sm">{t("confirmed_bookings")}</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed_bookings}</p>
            </div>
            <div className="card">
              <p className="text-gray-600 text-sm">{t("pending_bookings")}</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_bookings}</p>
            </div>
            <div className="card">
              <p className="text-gray-600 text-sm">{t("total_revenue")}</p>
              <p className="text-3xl font-bold text-indigo-600">₹{stats.total_revenue}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("stats")}
            className={`px-4 py-2 rounded ${tab === "stats" ? "btn-primary" : "btn-secondary"}`}
          >
            Stats
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`px-4 py-2 rounded ${tab === "bookings" ? "btn-primary" : "btn-secondary"}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setTab("payments")}
            className={`px-4 py-2 rounded ${tab === "payments" ? "btn-primary" : "btn-secondary"}`}
          >
            Payments
          </button>
        </div>

        {tab === "bookings" && (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking._id} className="card">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">#{booking._id?.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{booking.scheduleDate}</p>
                    <p className="text-sm text-gray-600">₹{booking.totalAmount}</p>
                  </div>
                  <span className="badge-success">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <div key={payment._id} className="card">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{payment.razorpayOrderId}</p>
                    <p className="text-sm text-gray-600">₹{payment.amount}</p>
                  </div>
                  <span className="badge-success">{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
