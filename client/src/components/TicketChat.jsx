import { useState, useRef, useEffect } from "react";

export default function TicketChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "🙏 Welcome! I can help you book darshan and tickets. Please tell me the place you want to visit." }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0: place, 1: date, 2: count, 3: confirm, 4: success
  const [booking, setBooking] = useState({ place: "", date: "", people: "" });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput("");

    // Step-based logic
    let reply = "";
    switch (step) {
      case 0: // Place
        setBooking((prev) => ({ ...prev, place: userInput }));
        reply = "Great! For which date?";
        setStep(1);
        break;
      case 1: // Date
        setBooking((prev) => ({ ...prev, date: userInput }));
        reply = "How many people?";
        setStep(2);
        break;
      case 2: // Count
        setBooking((prev) => ({ ...prev, people: userInput }));
        reply = `Confirm booking for ${booking.place} on ${booking.date} for ${userInput} people?`;
        setStep(3);
        break;
      case 3: // Confirm
        if (userInput.toLowerCase().startsWith("y") || userInput.toLowerCase().startsWith("ok")) {
          reply = "✅ Booking Confirmed! Your darshan slot is reserved. Please show the QR code at the entrance.";
          setBookingConfirmed(true);
          setStep(4);
        } else {
          reply = "No problem! Let me know how else I can assist you.";
          setStep(0);
          setBooking({ place: "", date: "", people: "" });
        }
        break;
      default:
        reply = "Let me know how else I can assist you.";
        setStep(0);
        setBooking({ place: "", date: "", people: "" });
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-orange-900">Book Darshan/Tickets</h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-orange-200 bg-white p-4 shadow-lg">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Booking Confirmed Card */}
        {bookingConfirmed && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-lg">
            <h3 className="text-lg font-bold text-emerald-900">Booking Confirmed</h3>
            <p className="mt-2 text-sm text-emerald-700">Show this QR at the entrance</p>
            {/* Placeholder QR Code */}
            <div className="mt-4 inline-block rounded-lg border-4 border-emerald-300 bg-white p-4">
              <div className="h-32 w-32 bg-gradient-to-br from-emerald-200 to-emerald-400">
                <div className="flex h-full items-center justify-center text-xs font-mono text-emerald-900">
                  QR CODE
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-orange-300 focus:ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
