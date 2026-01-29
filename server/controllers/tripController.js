import Trip from "../models/Trip.js";
import { generateTripPlan } from "../services/aiService.js";

function getDayDoc(trip, dayNumber) {
  if (!trip?.itinerary?.length) return null;
  return trip.itinerary.find((d) => d.dayNumber === dayNumber) || null;
}

export async function deleteTrip(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Trip.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.json({ message: "Trip deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete trip", error: err?.message });
  }
}

export async function getAllTrips(req, res) {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    return res.json(trips);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch trips", error: err?.message });
  }
}

export async function generateTrip(req, res) {
  try {
    const { city, days, language, originCity } = req.body || {};

    if (!city || !days) {
      return res.status(400).json({ message: "Missing required fields: city, days" });
    }

    const generated = await generateTripPlan(city, days, language, originCity);
    return res.json(generated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to generate trip", error: err?.message });
  }
}

export async function savePlannedTrip(req, res) {
  try {
    const { city, originCity, days, itinerary } = req.body || {};

    if (!city || !days || !itinerary) {
      return res.status(400).json({ message: "Missing required fields: city, days, itinerary" });
    }

    const trip = await Trip.create({
      city,
      originCity,
      days,
      itinerary,
      status: "PLANNED"
    });

    return res.status(201).json(trip);
  } catch (err) {
    return res.status(500).json({ message: "Failed to save planned trip", error: err?.message });
  }
}

export async function startTrip(req, res) {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.status = "ONGOING";
    trip.currentDay = 1;
    trip.currentStopIndex = 0;

    await trip.save();

    const day1 = getDayDoc(trip, 1) || trip.itinerary?.[0] || null;
    const firstStop = day1?.items?.[0] || null;

    if (!firstStop) {
      return res.status(400).json({ message: "Trip has no itinerary items to start" });
    }

    return res.json({
      tripId: trip._id,
      status: trip.status,
      currentDay: trip.currentDay,
      currentStopIndex: trip.currentStopIndex,
      stop: firstStop
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to start trip", error: err?.message });
  }
}

export async function nextStop(req, res) {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    let nextIndex = (trip.currentStopIndex ?? 0) + 1;
    let nextDay = trip.currentDay ?? 1;

    const currentDayDoc = getDayDoc(trip, nextDay);
    const currentDayItemsCount = currentDayDoc?.items?.length ?? 0;

    if (nextIndex > currentDayItemsCount - 1) {
      nextDay = nextDay + 1;
      nextIndex = 0;

      if (nextDay > (trip.days ?? 0)) {
        trip.status = "COMPLETED";
        await trip.save();
        return res.json({ message: "Trip Completed" });
      }
    }

    const nextDayDoc = getDayDoc(trip, nextDay);
    const stop = nextDayDoc?.items?.[nextIndex] || null;

    if (!stop) {
      return res.status(400).json({ message: "Next stop not found in itinerary" });
    }

    trip.currentDay = nextDay;
    trip.currentStopIndex = nextIndex;
    await trip.save();

    return res.json(stop);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get next stop", error: err?.message });
  }
}
