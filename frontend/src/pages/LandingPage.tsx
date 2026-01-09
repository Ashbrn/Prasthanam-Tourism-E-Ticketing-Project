import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <section className="container py-20 text-center">
          <h1 className="text-5xl font-bold mb-4 text-indigo-900">{t("app_title")}</h1>
          <p className="text-xl text-gray-600 mb-8">{t("app_tagline")}</p>

          <div className="flex gap-4 justify-center mb-12">
            <Link to="/chat" className="btn-primary px-8 py-3 text-lg">
              {t("book_ticket")}
            </Link>
            <Link to="/events" className="btn-secondary px-8 py-3 text-lg">
              {t("browse_events")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">🎟️ Easy Booking</h3>
              <p className="text-gray-600">Book tickets through our conversational chatbot interface</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-4">💳 Secure Payments</h3>
              <p className="text-gray-600">Secure payment processing with Razorpay integration</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-4">🌍 Multilingual</h3>
              <p className="text-gray-600">Support for multiple languages - English, Hindi, and French</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
