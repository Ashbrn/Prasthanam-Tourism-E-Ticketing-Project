# PRASTHANAM - PROJECT SPECIFICATIONS & MASTER PLAN

## 1. AI SYSTEM CONTEXT (THE BRAIN)
**Role:**
You are an AI system powering “Prasthanam”, an intelligent travel planning application.
You act as a deterministic, structured, and domain-aware travel planning agent.

**Core Rules:**
- You MUST strictly follow the custom agent skills.
- The user explicitly selects the number of days; the itinerary MUST scale to exactly that number.
- **Output must be pure JSON** (no markdown formatting, no chatter).

### Dynamic Inputs
- **City:** {{city}}
- **Days:** {{number_of_days}}
- **Trip Type:** Religious / Cultural

### Itinerary Rules
- Generate EXACTLY {{number_of_days}} days.
- Label days sequentially (1, 2, ... N).
- Each day MUST contain items for Morning, Afternoon, and Evening.
- Distribute attractions evenly; do not compress many places into few days.
- **Crowd Rules:** Use early morning/late evening for high-crowd temples.
- **Priority Rules:** High-priority temples must be scheduled earlier in the trip.

### 🧱 STRICT OUTPUT FORMAT (JSON ONLY)
You must output a valid JSON object matching this structure. Do NOT include markdown code blocks like ```json.

{
  "summary": "A brief text summary of the trip plan and advice.",
  "itinerary": [
    {
      "dayNumber": 1,
      "items": [
        {
          "period": "Morning",
          "place": "Place Name",
          "reason": "Why visiting here",
          "crowdLevel": "Low/Medium/High",
          "location": { "lat": 0.0, "lng": 0.0 }
        },
        {
          "period": "Afternoon",
          "place": "Next Place Name",
          "reason": "Why visiting here",
          "crowdLevel": "Low/Medium/High",
          "location": { "lat": 0.0, "lng": 0.0 }
        }
      ]
    }
  ]
}

---

## 2. DATABASE ARCHITECTURE (Phase A)
**Tech Stack:** MongoDB + Mongoose

### Mongoose Schema (`server/models/Trip.js`)
```javascript
import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema({
  period: String,        // Morning / Afternoon / Evening
  place: String,
  reason: String,
  crowdLevel: String,
  location: {            // Added for Live Route support
    lat: Number,
    lng: Number
  }
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  items: [itineraryItemSchema]
});

const tripSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    days: { type: Number, required: true },
    itinerary: [daySchema],
    status: {
      type: String,
      enum: ["PLANNED", "ONGOING", "COMPLETED"],
      default: "PLANNED"
    },
    currentDay: { type: Number, default: 1 },
    currentStopIndex: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
3. API LOGIC & FLOW (Phase B)
1. Save Planned Trip (POST /save)
Receives: { city, days, itinerary } (JSON from AI).

Action: Creates a new Trip document with status "PLANNED".

2. Start Trip (POST /:tripId/start)
Action:

Finds Trip by ID.

Updates status to "ONGOING".

Resets currentDay = 1 and currentStopIndex = 0.

Returns the first stop to the frontend.

3. Next Stop Logic (POST /:tripId/next)
Logic:

Increment currentStopIndex.

If index > number of items in current day:

Increment currentDay.

Reset currentStopIndex to 0.

If currentDay > total days:

Mark status as "COMPLETED".

Return "Trip Completed".

Else:

Return the next item object.

4. CITY CONFIGURATIONS (Phase C)
The AI Service must read these JSON files to understand the specific city context before generating a plan.

File: server/data/cities/mathura.json
JSON
{
  "city": "Mathura",
  "type": "Religious",
  "crowdPeakHours": ["10:00-13:00", "18:00-20:00"],
  "priorityTemples": [
    "Shri Krishna Janmabhoomi",
    "Banke Bihari Temple",
    "ISKCON Temple"
  ]
}
File: server/data/cities/varanasi.json
JSON
{
  "city": "Varanasi",
  "type": "Religious",
  "crowdPeakHours": ["07:00-10:00", "17:00-21:00"],
  "priorityTemples": [
    "Kashi Vishwanath Temple",
    "Dashashwamedh Ghat",
    "Assi Ghat"
  ]
}
File: server/data/cities/ayodhya.json
JSON
{
  "city": "Ayodhya",
  "type": "Religious",
  "crowdPeakHours": ["09:00-12:00", "18:00-20:00"],
  "priorityTemples": [
    "Ram Janmabhoomi",
    "Hanuman Garhi",
    "Kanak Bhawan"
  ]
}