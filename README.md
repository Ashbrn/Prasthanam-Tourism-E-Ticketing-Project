# Prasthanam 🕉️
### AI-Powered Spiritual Travel & Logistics Planner

**Prasthanam** (Sanskrit for *Journey*) is a specialized "Smart Tourism" platform designed to solve the logistical chaos of pilgrimage travel in India. Unlike generic travel apps, it uses **Generative AI (Gemini 1.5)** to create context-aware itineraries that account for temple opening hours, crowd predictions, and travel origin.

---

## 🚀 Key Features

### 🗺️ Smart AI Itinerary Planner
* **Context-Aware Routing:** Generates itineraries based on where the user is traveling *from*. (e.g., If entering Varanasi from Agra, the route starts from the northern entry points to save travel time).
* **Crowd Intelligence:** Predicts crowd levels (**High/Medium/Low**) based on historical data and time slots (e.g., flagging "Ganga Aarti" as high traffic).
* **Temple-Optimized Scheduling:** Automatically avoids the "Darshan Break" (typically 12 PM - 4 PM) and schedules museums or lunch during these hours.

### 🎟️ AI Ticket Concierge (Chatbot)
* **Natural Language Booking:** Users can chat with an AI assistant to book tickets (e.g., *"Book 2 tickets for Sarnath Zoo on Sunday"*).
* **Smart Slot Advisory:** Warns users if a specific attraction requires advance online booking vs. on-spot tickets.
* **QR Code Generation:** Simulates a complete booking flow with instant QR code tickets.

### 📍 Live Navigation & Tracking
* **Interactive Map:** Visualizes the entire trip on a customized **Leaflet Map**.
* **Real-Time Tracking:** Shows the user's live location ("Blue Dot") relative to the next destination.
* **Progress Tracking:** "Mark as Visited" feature updates the itinerary status in real-time.

### 🏠 Unified Dashboard
* **Trip Management:** Save and manage multiple upcoming and past trips.
* **Multi-Language Support:** Generates plans in **English, Hindi, and Hinglish** to cater to diverse user bases.

---

## 🛠️ Tech Stack

**Frontend:**
* **React.js (Vite):** Fast, modern UI framework.
* **Tailwind CSS:** For responsive, beautiful styling.
* **Leaflet Maps:** Open-source interactive maps.
* **Lucide React:** Modern iconography.

**Backend:**
* **Node.js & Express.js:** Robust REST API.
* **Google Gemini 1.5 Flash:** The "Brain" behind the logic and planning.
* **MongoDB & Mongoose:** Persistent storage for user trips and profiles.

---

## 🧠 System Architecture

1.  **User Input:** User selects "Mathura", Origin "Delhi", "2 Days".
2.  **Prompt Engineering:** The backend constructs a strict system prompt enforcing logic (e.g., "Start at geographically closest point").
3.  **AI Processing:** Gemini AI returns a structured JSON object (not just text).
4.  **Validation:** Backend parses and validates the JSON before saving to MongoDB.
5.  **Visualization:** Frontend renders the JSON into interactive Day Cards and Map Markers.

---

## ⚡ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/Ashbrn/Prasthanam-Tourism-E-Ticketing-Project.git](https://github.com/Ashbrn/Prasthanam-Tourism-E-Ticketing-Project.git)
cd prasthanam
```
---

### 2. **Backend Setup**
```Bash
# Install backend dependencies
npm install
```
# Create a .env file in the root directory and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

# Start the Server
```Bash
node server.js
```
###3. Frontend Setup
```Bash
cd client

# Install frontend dependencies
npm install

# Start the React App
npm run dev
The app will launch at http://localhost:5173.
```

#Future Scope

Live Crowd Data: Integration with Google Places API for real-time popularity graphs.

Payment Gateway: Razorpay integration for actual ticket payments.

Hotel Recommendations: AI suggestions for ashrams/hotels near the first stop of the day.
