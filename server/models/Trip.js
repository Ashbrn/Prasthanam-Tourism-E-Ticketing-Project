import mongoose from "mongoose";

const ticketInfoSchema = new mongoose.Schema({
  required: { type: Boolean, default: false },
  approxPrice: String,
  bookingType: { type: String, enum: ["Online", "On Spot"] },
  link: String
});

const itineraryItemSchema = new mongoose.Schema({
  period: String,
  place: String,
  reason: String,
  tips: String,
  crowdLevel: String,
  ticketInfo: ticketInfoSchema,
  location: {
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
    originCity: { type: String },
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
