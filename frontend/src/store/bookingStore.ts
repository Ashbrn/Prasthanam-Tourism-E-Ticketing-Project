import { create } from "zustand";
import { BookingDraft } from "../types";

interface BookingStore {
  currentBooking: BookingDraft | null;
  eventId: string | null;
  selectedDate: string | null;
  selectedTickets: { [key: string]: number };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;

  setEventId: (eventId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTickets: (tickets: { [key: string]: number }) => void;
  setContactInfo: (info: { name: string; email: string; phone: string }) => void;
  setCurrentBooking: (booking: BookingDraft) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  currentBooking: null,
  eventId: null,
  selectedDate: null,
  selectedTickets: {},
  contactInfo: null,

  setEventId: (eventId) => set({ eventId }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTickets: (tickets) => set({ selectedTickets: tickets }),
  setContactInfo: (info) => set({ contactInfo: info }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  clearBooking: () =>
    set({
      currentBooking: null,
      eventId: null,
      selectedDate: null,
      selectedTickets: {},
      contactInfo: null,
    }),
}));
