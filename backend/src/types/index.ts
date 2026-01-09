export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  preferredLanguage: string;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEvent {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  userId?: any;
  eventId: any;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayment {
  _id?: string;
  bookingId: any;
  userId?: any;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  method?: string;
  signatureVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  _id?: string;
  userId?: any;
  sessionId: string;
  language: string;
  messages: Array<{
    from: "user" | "bot";
    text: string;
    ts: Date;
  }>;
  intent?: string;
  entities?: { [key: string]: any };
  resolved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  roles: string[];
}

export interface ChatMessage {
  sessionId: string;
  userId?: string;
  message: string;
  language: string;
}

export interface ChatReply {
  reply: string;
  actions: Array<{
    type: string;
    payload: any;
  }>;
}
