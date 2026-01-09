import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import { Event } from "../types";
import Header from "../components/Header";

export default function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [city, search]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/events", {
        params: { city, q: search },
      });
      setEvents(response.data.items);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{t("events")}</h1>

        <div className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder={t("search_events")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="loading inline-block"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event._id} to={`/events/${event.slug}`}>
                <div className="card h-full hover:shadow-lg transition-shadow">
                  {event.images[0] && (
                    <img src={event.images[0]} alt={event.title.en} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="text-xl font-bold mb-2">{event.title.en || event.title.hi}</h3>
                  <p className="text-gray-600 text-sm mb-4">{event.location.city}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-bold">
                      ₹{event.ticketTypes[0]?.price || "N/A"}
                    </span>
                    <span className="badge-primary">{t("view_details")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
