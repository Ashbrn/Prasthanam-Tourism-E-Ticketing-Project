import { Event } from "../models/Event";
import { AppError } from "../middleware/error";

export class EventService {
  async listEvents(filters: {
    city?: string;
    date?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.city) {
      query["location.city"] = { $regex: filters.city, $options: "i" };
    }

    if (filters.q) {
      query.$or = [
        { "title.en": { $regex: filters.q, $options: "i" } },
        { "title.hi": { $regex: filters.q, $options: "i" } },
        { slug: { $regex: filters.q, $options: "i" } },
      ];
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      items: events,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getEventBySlug(slug: string) {
    const event = await Event.findOne({ slug });
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }

  async getEventById(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }

  async createEvent(data: any) {
    const existingSlug = await Event.findOne({ slug: data.slug });
    if (existingSlug) {
      throw new AppError(400, "Event with this slug already exists");
    }

    const event = new Event(data);
    await event.save();
    return event;
  }

  async updateEvent(id: string, data: any) {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }

  async deleteEvent(id: string) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }
}
