import { useMemo, useRef } from "react";

function PeriodCard({ item, visited, onMarkVisited, setRef }) {
  const ticket = item.ticketInfo;
  const needsTicket = ticket?.required;

  return (
    <div
      ref={setRef}
      className={`rounded-xl border p-4 shadow-sm transition ${
        visited ? "border-slate-200 bg-slate-50 opacity-75" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-orange-700">{item.period}</div>
            {needsTicket && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                Ticket Required
              </span>
            )}
          </div>
          <div className="mt-1 text-base font-semibold text-slate-900">{item.place}</div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          {item.crowdLevel || "—"}
        </span>
      </div>
      {item.reason ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.reason}</p> : null}
      {item.tips ? <p className="mt-2 text-xs italic text-slate-500">{item.tips}</p> : null}
      {needsTicket ? (
        <div className="mt-3 space-y-2">
          {ticket.approxPrice && (
            <div className="text-sm font-medium text-slate-700">Approx {ticket.approxPrice}</div>
          )}
          {ticket.link && (
            <a
              href={ticket.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-yellow-600"
            >
              Book Slot ↗
            </a>
          )}
          {ticket.bookingType === "Online" && (
            <div className="text-xs text-amber-700">⚠️ Book in advance!</div>
          )}
        </div>
      ) : null}
      {item.location?.lat != null && item.location?.lng != null ? (
        <div className="mt-3 text-xs text-slate-500">
          Location: {item.location.lat}, {item.location.lng}
        </div>
      ) : null}

      <div className="mt-4">
        <button
          type="button"
          onClick={onMarkVisited}
          disabled={visited}
          className={`w-full rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition ${
            visited
              ? "cursor-not-allowed bg-slate-200 text-slate-600"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {visited ? "Visited" : "Mark as Visited"}
        </button>
      </div>
    </div>
  );
}

export default function ItineraryDisplay({ trip, visitedStops, onMarkVisited }) {
  const days = Array.isArray(trip?.itinerary) ? trip.itinerary : [];
  const refs = useRef({});

  const flatStopKeys = useMemo(() => {
    const out = [];
    for (const day of days) {
      for (let idx = 0; idx < (day.items || []).length; idx += 1) {
        out.push(`${day.dayNumber}-${idx}`);
      }
    }
    return out;
  }, [days]);

  function findNextUnvisitedKey(currentKey) {
    const currentIndex = flatStopKeys.indexOf(currentKey);
    if (currentIndex === -1) return null;

    for (let i = currentIndex + 1; i < flatStopKeys.length; i += 1) {
      const key = flatStopKeys[i];
      if (!visitedStops?.[key]) return key;
    }
    return null;
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-900">Trip Preview</h2>
          <p className="text-sm leading-relaxed text-slate-600">{trip?.summary || ""}</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {days.map((day) => (
          <div key={day.dayNumber} className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Day {day.dayNumber}</h3>
              <div className="text-xs font-medium text-slate-500">Morning • Afternoon • Evening</div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {(day.items || []).map((item, idx) => {
                const stopKey = `${day.dayNumber}-${idx}`;
                const visited = Boolean(visitedStops?.[stopKey]);

                return (
                  <PeriodCard
                    key={stopKey}
                    item={item}
                    visited={visited}
                    setRef={(el) => {
                      if (el) refs.current[stopKey] = el;
                    }}
                    onMarkVisited={() => {
                      if (visited) return;
                      onMarkVisited?.(stopKey);

                      const nextKey = findNextUnvisitedKey(stopKey);
                      if (nextKey) {
                        setTimeout(() => {
                          refs.current[nextKey]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 50);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
