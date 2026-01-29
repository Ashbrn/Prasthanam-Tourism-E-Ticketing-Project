import { useState } from "react";

export default function Home({ onViewChange }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-white px-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-orange-900 sm:text-5xl">
          Prasthanam
        </h1>
        <p className="mb-12 text-lg text-orange-700 sm:text-xl">Your Spiritual Companion</p>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Card 1: Plan a Pilgrimage */}
          <button
            onClick={() => onViewChange("create")}
            className="group rounded-3xl border border-orange-200 bg-white p-8 shadow-xl transition-all hover:scale-105 hover:border-orange-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md transition-transform group-hover:scale-110">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Plan a Pilgrimage</h3>
            <p className="text-sm text-slate-600">Create a custom day‑wise spiritual itinerary</p>
          </button>

          {/* Card 2: Book Darshan/Tickets */}
          <button
            onClick={() => onViewChange("booking")}
            className="group rounded-3xl border border-orange-200 bg-white p-8 shadow-xl transition-all hover:scale-105 hover:border-orange-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md transition-transform group-hover:scale-110">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Book Darshan/Tickets</h3>
            <p className="text-sm text-slate-600">Chat with AI to book temple visits</p>
          </button>

          {/* Card 3: My Journeys */}
          <button
            onClick={() => onViewChange("dashboard")}
            className="group rounded-3xl border border-orange-200 bg-white p-8 shadow-xl transition-all hover:scale-105 hover:border-orange-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-400 text-white shadow-md transition-transform group-hover:scale-110">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">My Journeys</h3>
            <p className="text-sm text-slate-600">View and resume your past trips</p>
          </button>
        </div>

        <div className="mt-16 text-center text-sm text-orange-600">
          <p>🙏 Begin your divine journey with Prasthanam</p>
        </div>
      </div>
    </div>
  );
}
