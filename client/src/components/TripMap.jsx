import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, points]);

  return null;
}

export default function TripMap({ itinerary, visitedStops, showUserLocation }) {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoDenied, setGeoDenied] = useState(false);
  const alertedRef = useRef(false);

  useEffect(() => {
    if (!showUserLocation) return;
    if (!navigator.geolocation) {
      if (!alertedRef.current) {
        alertedRef.current = true;
        window.alert("Location services are not available in this browser.");
      }
      return;
    }

    setGeoDenied(false);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        if (err?.code === 1 || err?.code === err?.PERMISSION_DENIED) {
          setGeoDenied(true);
          if (!alertedRef.current) {
            alertedRef.current = true;
            window.alert("We can’t access your location. Please allow GPS permission to use live navigation.");
          }
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [showUserLocation]);

  const stops = useMemo(() => {
    const out = [];
    for (const day of itinerary || []) {
      for (let idx = 0; idx < (day.items || []).length; idx += 1) {
        const item = day.items[idx];
        const lat = item?.location?.lat;
        const lng = item?.location?.lng;
        if (typeof lat === "number" && typeof lng === "number") {
          const stopKey = `${day.dayNumber}-${idx}`;
          out.push({
            stopKey,
            dayNumber: day.dayNumber,
            idx,
            item,
            position: [lat, lng]
          });
        }
      }
    }
    return out;
  }, [itinerary]);

  const points = useMemo(() => stops.map((s) => s.position), [stops]);

  const center = points[0] || [25.3176, 82.9739];

  function handleRecenter() {
    if (!map) return;
    if (!userLocation) {
      window.alert("Waiting for your location...");
      return;
    }
    map.flyTo(userLocation, 16, { duration: 0.8 });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white/80 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-orange-100 px-5 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Live Map</div>
          <div className="text-xs text-slate-500">Stops are connected in order</div>
        </div>
        <div className="flex items-center gap-2">
          {showUserLocation ? (
            <button
              onClick={handleRecenter}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              type="button"
            >
              Recenter on Me
            </button>
          ) : null}
          <div className="text-xs font-semibold text-amber-700">{points.length} stops</div>
        </div>
      </div>

      {geoDenied ? (
        <div className="border-b border-orange-100 bg-orange-50 px-5 py-3 text-xs text-slate-700">
          Location permission denied. Live navigation is disabled.
        </div>
      ) : null}

      <MapContainer center={center} zoom={12} className="h-80 w-full" whenCreated={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.length ? <FitBounds points={points} /> : null}

        {showUserLocation && userLocation ? (
          <CircleMarker
            center={userLocation}
            radius={10}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9, weight: 3 }}
          >
            <Popup>
              <div className="text-sm font-semibold">You are here</div>
            </Popup>
          </CircleMarker>
        ) : null}

        {stops.map((s) => {
          const visited = Boolean(visitedStops?.[s.stopKey]);

          return (
            <CircleMarker
              key={s.stopKey}
              center={s.position}
              radius={8}
              pathOptions={
                visited
                  ? { color: "#16a34a", fillColor: "#22c55e", fillOpacity: 0.95, weight: 3 }
                  : { color: "#ea580c", fillColor: "#fb923c", fillOpacity: 0.9, weight: 3 }
              }
            >
              <Popup>
                <div className="text-sm font-semibold">Day {s.dayNumber} • {s.item.period}</div>
                <div className="text-sm">{s.item.place}</div>
                <div className="mt-1 text-xs">{visited ? "Visited" : "Not visited"}</div>
              </Popup>
            </CircleMarker>
          );
        })}

        {points.length >= 2 ? <Polyline positions={points} pathOptions={{ color: "#ea580c", weight: 4 }} /> : null}
      </MapContainer>
    </div>
  );
}
