import { useState } from "react";

import { generateTrip, saveTrip, startTrip } from "./api.js";
import Home from "./components/Home.jsx";
import ItineraryDisplay from "./components/ItineraryDisplay.jsx";
import MyTrips from "./components/MyTrips.jsx";
import TicketChat from "./components/TicketChat.jsx";
import TripForm from "./components/TripForm.jsx";
import TripMap from "./components/TripMap.jsx";

export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'create' | 'dashboard' | 'live' | 'booking'
  const [trip, setTrip] = useState(null);
  const [tripMeta, setTripMeta] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [visitedStops, setVisitedStops] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startInfo, setStartInfo] = useState(null);

  async function handleGenerate({ city, originCity, days, language }) {
    setLoading(true);
    setError("");
    setStartInfo(null);
    setTripId(null);
    setVisitedStops({});

    try {
      const data = await generateTrip(city, days, language, originCity);
      setTrip(data);
      setTripMeta({ city, originCity, days, language });
      setView("live");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to generate trip";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAndStart() {
    if (!trip || !tripMeta) return;

    setLoading(true);
    setError("");
    setStartInfo(null);

    try {
      const saved = await saveTrip({
        city: tripMeta.city,
        originCity: tripMeta.originCity,
        days: tripMeta.days,
        itinerary: trip.itinerary
      });

      setTripId(saved._id);

      const started = await startTrip(saved._id);
      setStartInfo(started);
      setView("live");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save/start trip";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setTrip(null);
    setTripMeta(null);
    setTripId(null);
    setError("");
    setStartInfo(null);
    setVisitedStops({});
    setView("dashboard");
  }

  function handleSelectPastTrip(t) {
    setTrip(t);
    setTripMeta({ city: t.city, originCity: t.originCity, days: t.days });
    setTripId(t._id);
    setStartInfo(null);
    setVisitedStops({});
    setView("live");
  }

  function handleResume(t) {
    setTrip(t);
    setTripMeta({ city: t.city, originCity: t.originCity, days: t.days });
    setTripId(t._id);
    setStartInfo(null);
    setVisitedStops({});
    setView("live");
  }

  function handleMarkVisited(stopKey) {
    setVisitedStops((prev) => ({ ...prev, [stopKey]: true }));
  }

  const hasSavedId = Boolean(trip?._id || tripId);
  const showSaveAndStart = Boolean(trip && tripMeta && !hasSavedId);
  const effectiveLiveMode = view === "live";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Spiritual Itinerary Planner
            </div>

            <nav className="inline-flex overflow-hidden rounded-xl border border-orange-100 bg-white/70 shadow-sm backdrop-blur">
              <button
                onClick={() => setView("home")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  view === "home" ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-orange-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setView("create");
                  setTrip(null);
                }}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  view === "create" ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-orange-50"
                }`}
              >
                New Trip
              </button>
              <button
                onClick={() => setView("dashboard")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  view === "dashboard" ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-orange-50"
                }`}
              >
                My Trips
              </button>
              <button
                onClick={() => setView("booking")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  view === "booking" ? "bg-orange-600 text-white" : "text-slate-700 hover:bg-orange-50"
                }`}
              >
                Book
              </button>
            </nav>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {view === "home" && <Home onViewChange={setView} />}
        {view === "dashboard" && <MyTrips onSelect={handleSelectPastTrip} onResume={handleResume} />}
        {view === "create" && <TripForm onGenerate={handleGenerate} loading={loading} />}
        {view === "booking" && <TicketChat />}
        {view === "live" && trip && (
          <div className="flex-1">
            <div className="mb-6">
              <button
                onClick={() => {
                  setView("dashboard");
                  setTrip(null);
                }}
                className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                ← Back to All Trips
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-700">{tripMeta?.city}</div>
                  <div className="text-xs text-slate-500">
                    {tripMeta?.days} day(s) • {effectiveLiveMode ? "Live Mode" : "Preview mode"}
                    {trip?._id ? ` • Trip ID: ${trip._id}` : tripId ? ` • Trip ID: ${tripId}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reset
                  </button>

                  {showSaveAndStart ? (
                    <button
                      onClick={handleSaveAndStart}
                      disabled={loading}
                      className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:from-orange-700 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Working..." : "Save & Start Trip"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {effectiveLiveMode ? (
              <div className="space-y-6">
                <TripMap itinerary={trip.itinerary} visitedStops={visitedStops} showUserLocation />

                {startInfo?.stop ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
                    <div className="font-semibold">Current stop</div>
                    <div className="mt-1 text-emerald-800">{startInfo.stop.place}</div>
                  </div>
                ) : null}

                <ItineraryDisplay trip={trip} visitedStops={visitedStops} onMarkVisited={handleMarkVisited} />
              </div>
            ) : (
              <ItineraryDisplay trip={trip} visitedStops={visitedStops} onMarkVisited={handleMarkVisited} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
