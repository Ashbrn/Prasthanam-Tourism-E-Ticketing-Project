import { useMemo, useState } from "react";

const LANGUAGES = ["English", "Hindi", "Hinglish"];

export default function TripForm({ onGenerate, loading }) {
  const [city, setCity] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [days, setDays] = useState(2);
  const [language, setLanguage] = useState("English");

  const isValid = useMemo(() => {
    const d = Number(days);
    return city?.trim() && originCity?.trim() && Number.isFinite(d) && d >= 1 && d <= 14 && language;
  }, [city, originCity, days, language]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    onGenerate({ city: city.trim(), originCity: originCity.trim(), days: Number(days), language });
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-orange-200 bg-orange-50 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-orange-900">Prasthanam</h1>
        <p className="mt-2 text-base text-orange-700">Begin your spiritual journey with a personalized itinerary.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-orange-900">Destination</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-orange-200 bg-white px-5 py-3 text-slate-900 shadow-md outline-none ring-orange-300 focus:ring"
            disabled={loading}
            placeholder="e.g., Mathura"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-900">Coming From (Origin)</label>
          <input
            type="text"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-orange-200 bg-white px-5 py-3 text-slate-900 shadow-md outline-none ring-orange-300 focus:ring"
            disabled={loading}
            placeholder="e.g., Agra or Delhi"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-900">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-orange-200 bg-white px-5 py-3 text-slate-900 shadow-md outline-none ring-orange-300 focus:ring"
            disabled={loading}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-900">Days</label>
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-orange-200 bg-white px-5 py-3 text-slate-900 shadow-md outline-none ring-orange-300 focus:ring"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-orange-600">Tip: 2-3 days is ideal for a relaxed pace.</p>
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-orange-300 transition hover:from-orange-700 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-orange-200 bg-white px-6 py-4 text-sm text-orange-800">
        <div className="font-semibold">What you’ll get</div>
        <div className="mt-1 text-orange-700">A preview itinerary (Morning / Afternoon / Evening) optimized for crowds and pacing, with practical tips for each place.</div>
      </div>
    </div>
  );
}
