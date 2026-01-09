import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "../types";

export interface IEventDocument extends Omit<IEvent, '_id'>, Document {}

const eventSchema = new Schema<IEventDocument>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: Schema.Types.Mixed, required: true },
    images: { type: [String], default: [] },
    location: {
      city: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    schedule: [
      {
        date: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true },
        capacity: { type: Number, required: true },
      },
    ],
    ticketTypes: [
      {
        id: { type: String, required: true },
        label: { type: Schema.Types.Mixed, required: true },
        price: { type: Number, required: true },
        taxPercent: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ slug: 1 });
eventSchema.index({ "location.city": 1 });

export const Event = mongoose.model<IEventDocument>("Event", eventSchema);
