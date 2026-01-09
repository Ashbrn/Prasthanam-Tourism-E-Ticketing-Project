import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import { Event } from "../types";
import { useBookingStore } from "../store/bookingStore";
import Header from "../components/Header";

export default function EventDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setEventId, setSelectedDate, setSelectedTickets } = useBookingStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setLocalSelectedDate] = useState("");
  const [ticketQty, setTicketQty] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await apiClient.get(`/events/${slug}`);
      setEvent(response.data);
      setLocalSelectedDate(response.data.schedule[0]?.date || "");
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!event || !selectedDate) return;

    setEventId(event._id);
    setSelectedDate(selectedDate);
    setSelectedTickets(ticketQty);
    navigate("/booking");
  };

  if (loading) return <div>{t("loading")}</div>;
  if (!event) return <div>{t("error")}</div>;

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {event.images[0] && (
              <img
                src={event.images[0]}
                alt={event.title.en}
                className="w-full rounded-lg shadow-lg mb-4"
              />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{event.title.en}</h1>
            <p className="text-gray-600 mb-4">{event.description.en}</p>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">{t("select_date")}</h3>
              <select
                value={selectedDate}
                onChange={(e) => setLocalSelectedDate(e.target.value)}
                className="input"
              >
                {event.schedule.map((schedule) => (
                  <option key={schedule.date} value={schedule.date}>
                    {schedule.date} ({schedule.start} - {schedule.end})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">{t("select_tickets")}</h3>
              <div className="space-y-3">
                {event.ticketTypes.map((ticketType) => (
                  <div key={ticketType.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ticketType.label.en}</p>
                      <p className="text-sm text-gray-600">
                        ₹{ticketType.price} ({ticketType.taxPercent}% tax)
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={ticketQty[ticketType.id] || 0}
                      onChange={(e) => {
                        setTicketQty({
                          ...ticketQty,
                          [ticketType.id]: parseInt(e.target.value),
                        });
                      }}
                      className="input w-20"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleBooking} className="btn-primary w-full py-3">
              {t("proceed_to_payment")}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
