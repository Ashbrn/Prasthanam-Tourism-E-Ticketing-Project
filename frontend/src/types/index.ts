export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  preferredLanguage: string;
  roles: string[];
}

export interface Event {
  _id: string;
  title: { [key: string]: string };
  slug: string;
  description: { [key: string]: string };
  images: string[];
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  schedule: Array<{
    date: string;
    start: string;
    end: string;
    capacity: number;
  }>;
  ticketTypes: Array<{
    id: string;
    label: { [key: string]: string };
    price: number;
    taxPercent: number;
  }>;
}

export interface Booking {
  _id: string;
  userId?: string;
  eventId: string;
  scheduleDate: string;
  tickets: Array<{
    typeId: string;
    qty: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface BookingDraft {
  bookingId: string;
  summary: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
}
