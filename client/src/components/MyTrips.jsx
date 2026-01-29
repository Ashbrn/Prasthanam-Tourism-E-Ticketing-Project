import { useEffect, useState } from "react";

import { deleteTrip, getAllTrips } from "../api.js";

const SPIRITUAL_QUOTES = [
  "The journey of a thousand miles begins with a single step.",
  "Travel makes one modest. You see what a tiny place you occupy in the world.",
  "Not all those who wander are lost.",
  "The soul of the journey is the path itself."
];

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function MyTrips({ onSelect, onResume }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quote] = useState(() => SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)]);

  const ongoingTrip = trips.find((t) => t.status === "ONGOING");
  const pastTrips = trips.filter((t) => t.status !== "ONGOING");

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();

    const prevTrips = [...trips];
    setTrips((cur) => cur.filter((t) => t._id !== id));
    setError("");

    try {
      await deleteTrip(id);
    } catch (err) {
      setTrips(prevTrips);
      const msg = err?.response?.data?.message || err?.message || "Failed to delete trip";
      setError(msg);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getAllTrips();
        if (!cancelled) setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Failed to load trips";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* Welcome */}
      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-orange-900">Welcome Back</h2>
        <p className="mt-3 text-lg italic text-orange-700">“{quote}”</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-center text-sm text-slate-600">Loading trips...</div>
      ) : (
        <>
          {/* Current Journey */}
          {ongoingTrip ? (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Current Journey</h3>
              <div
                onClick={() => onSelect(ongoingTrip)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(ongoingTrip);
                }}
                role="button"
                tabIndex={0}
                className="cursor-pointer rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-md transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-emerald-900">{ongoingTrip.city}</div>
                    <div className="mt-1 text-sm text-emerald-700">{ongoingTrip.days} day(s) • ONGOING</div>
                    <div className="mt-2 text-xs text-emerald-600">{formatDate(ongoingTrip.createdAt)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onResume(ongoingTrip);
                    }}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Past Pilgrimages */}
          {pastTrips.length ? (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Past Pilgrimages</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastTrips.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => onSelect(t)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onSelect(t);
                    }}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{t.city}</div>
                        <div className="mt-1 text-xs text-slate-500">{formatDate(t.createdAt)}</div>
                        <div className="mt-2">
                          <span className="inline-block rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{t.status}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, t._id)}
                        className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !ongoingTrip ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
              No trips yet. Generate a new trip and save it.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
