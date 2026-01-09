import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../config/database";
import { Event } from "../models/Event";
import { User } from "../models/User";

dotenv.config();

const seedData = async () => {
  await connectDB();

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@prasthanam.com",
      password: "Admin@123",
      preferredLanguage: "en",
      roles: ["admin", "user"],
    },
    {
      name: "Test User",
      email: "user@prasthanam.com",
      password: "User@123",
      preferredLanguage: "en",
      roles: ["user"],
    },
  ]);

  const events = await Event.insertMany([
    {
      title: { en: "Heritage Walk Varanasi", hi: "वाराणसी हेरिटेज वॉक" },
      slug: "heritage-walk-varanasi",
      description: { en: "Explore the ancient temples and ghats of Varanasi", hi: "वाराणसी के प्राचीन मंदिरों और घाटों की खोज करें" },
      images: ["https://via.placeholder.com/400x300?text=Varanasi"],
      location: { city: "Varanasi", lat: 25.3209, lng: 82.9856 },
      schedule: [
        {
          date: "2025-12-20",
          start: "06:00",
          end: "10:00",
          capacity: 50,
        },
        {
          date: "2025-12-21",
          start: "06:00",
          end: "10:00",
          capacity: 50,
        },
      ],
      ticketTypes: [
        {
          id: "adult",
          label: { en: "Adult", hi: "वयस्क" },
          price: 500,
          taxPercent: 18,
        },
        {
          id: "child",
          label: { en: "Child", hi: "बच्चा" },
          price: 250,
          taxPercent: 18,
        },
      ],
    },
    {
      title: { en: "Taj Mahal Sunrise Tour", hi: "ताज महल सूर्योदय दौरा" },
      slug: "taj-mahal-sunrise-tour",
      description: { en: "Experience the beauty of Taj Mahal at sunrise", hi: "सूर्योदय पर ताज महल की सुंदरता का अनुभव लें" },
      images: ["https://via.placeholder.com/400x300?text=Taj+Mahal"],
      location: { city: "Agra", lat: 27.1751, lng: 78.0421 },
      schedule: [
        {
          date: "2025-12-20",
          start: "05:30",
          end: "08:30",
          capacity: 100,
        },
        {
          date: "2025-12-21",
          start: "05:30",
          end: "08:30",
          capacity: 100,
        },
      ],
      ticketTypes: [
        {
          id: "adult",
          label: { en: "Adult", hi: "वयस्क" },
          price: 1000,
          taxPercent: 18,
        },
        {
          id: "child",
          label: { en: "Child", hi: "बच्चा" },
          price: 500,
          taxPercent: 18,
        },
      ],
    },
  ]);

  console.log("✅ Seed data inserted successfully");
  console.log(`✅ ${users.length} users created`);
  console.log(`✅ ${events.length} events created`);

  await disconnectDB();
};

seedData().catch((error) => {
  console.error("❌ Seed error:", error);
  process.exit(1);
});
