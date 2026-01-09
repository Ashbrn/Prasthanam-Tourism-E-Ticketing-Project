import { Conversation } from "../models/Conversation";
import { Event } from "../models/Event";
import { ChatMessage, ChatReply } from "../types";

const GREETINGS = ["hello", "hi", "hey", "namaste"];
const BOOK_KEYWORDS = ["book", "ticket", "reserve", "get"];
const PRICE_KEYWORDS = ["price", "cost", "how much", "fee"];
const AVAILABILITY_KEYWORDS = ["available", "availability", "seats", "capacity"];
const FAQ_KEYWORDS = ["policy", "cancellation", "refund", "timing", "direction"];

interface Intent {
  type: string;
  confidence: number;
  entities: { [key: string]: any };
}

export class ChatbotService {
  async processMessage(message: ChatMessage): Promise<ChatReply> {
    let conversation = await Conversation.findOne({
      sessionId: message.sessionId,
    });

    if (!conversation) {
      conversation = new Conversation({
        sessionId: message.sessionId,
        userId: message.userId,
        language: message.language,
        messages: [],
      });
    }

    conversation.messages.push({
      from: "user",
      text: message.message,
      ts: new Date(),
    });

    const intent = this.detectIntent(message.message, message.language);
    conversation.intent = intent.type;
    conversation.entities = intent.entities;

    let reply: ChatReply;

    switch (intent.type) {
      case "book_ticket":
        reply = await this.handleBooking(intent, message.language);
        break;
      case "ask_price":
        reply = await this.handlePriceQuery(intent, message.language);
        break;
      case "ask_availability":
        reply = await this.handleAvailabilityQuery(intent, message.language);
        break;
      case "faq":
        reply = this.handleFAQ(intent, message.language);
        break;
      case "greet":
        reply = this.handleGreeting(message.language);
        break;
      default:
        reply = this.handleFallback(message.language);
    }

    conversation.messages.push({
      from: "bot",
      text: reply.reply,
      ts: new Date(),
    });

    if (intent.type !== "greet" && intent.type !== "faq") {
      conversation.resolved = true;
    }

    await conversation.save();

    return reply;
  }

  private detectIntent(message: string, language: string): Intent {
    const lowerMessage = message.toLowerCase();

    if (GREETINGS.some((g) => lowerMessage.includes(g))) {
      return { type: "greet", confidence: 0.9, entities: {} };
    }

    if (BOOK_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      const eventMatch = this.extractEventName(message);
      const qtyMatch = this.extractQuantity(message);
      return {
        type: "book_ticket",
        confidence: 0.8,
        entities: { event: eventMatch, quantity: qtyMatch },
      };
    }

    if (PRICE_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      const eventMatch = this.extractEventName(message);
      return {
        type: "ask_price",
        confidence: 0.75,
        entities: { event: eventMatch },
      };
    }

    if (AVAILABILITY_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      const eventMatch = this.extractEventName(message);
      const dateMatch = this.extractDate(message);
      return {
        type: "ask_availability",
        confidence: 0.75,
        entities: { event: eventMatch, date: dateMatch },
      };
    }

    if (FAQ_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      return { type: "faq", confidence: 0.7, entities: {} };
    }

    return { type: "fallback", confidence: 0.1, entities: {} };
  }

  private extractEventName(message: string): string | null {
    const patterns = ["for (.+?)(?: on|$)", "(.+?) ticket"];
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, "i");
      const match = message.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  private extractQuantity(message: string): number | null {
    const match = message.match(/(\d+)\s*(?:ticket|person)/i);
    return match ? parseInt(match[1]) : null;
  }

  private extractDate(message: string): string | null {
    const patterns = [
      /(\d{1,2}(?:st|nd|rd|th)?)\s+(?:of\s+)?(\w+)/i,
      /(\d{4}-\d{2}-\d{2})/,
    ];
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  private async handleBooking(intent: Intent, language: string): Promise<ChatReply> {
    const eventName = intent.entities.event;
    const quantity = intent.entities.quantity || 1;

    if (!eventName) {
      return {
        reply:
          language === "hi"
            ? "कृपया बताएं कि आप किस इवेंट के लिए टिकट बुक करना चाहते हैं?"
            : "Which event would you like to book tickets for?",
        actions: [
          {
            type: "text_prompt",
            payload: { field: "event", question: "Event name" },
          },
        ],
      };
    }

    const event = await Event.findOne({
      $or: [
        { slug: eventName.toLowerCase().replace(/\s+/g, "-") },
        { "title.en": { $regex: eventName, $options: "i" } },
      ],
    });

    if (!event) {
      return {
        reply:
          language === "hi"
            ? `मुझे "${eventName}" नाम का कोई इवेंट नहीं मिला। कृपया सही इवेंट का नाम दें।`
            : `I couldn't find an event called "${eventName}". Could you try another search?`,
        actions: [{ type: "event_search", payload: { query: eventName } }],
      };
    }

    return {
      reply:
        language === "hi"
          ? `बहुत अच्छे! आप ${quantity} टिकट बुक करना चाहते हैं। कृपया तारीख चुनें।`
          : `Great! You want to book ${quantity} tickets. Please select a date.`,
      actions: [
        {
          type: "date_picker",
          payload: { event_id: event._id, quantity },
        },
      ],
    };
  }

  private async handlePriceQuery(intent: Intent, language: string): Promise<ChatReply> {
    const eventName = intent.entities.event;

    if (!eventName) {
      return {
        reply:
          language === "hi"
            ? "किस इवेंट के लिए कीमत जानना चाहते हैं?"
            : "Which event's price would you like to know?",
        actions: [{ type: "event_search", payload: {} }],
      };
    }

    const event = await Event.findOne({
      $or: [
        { slug: eventName.toLowerCase().replace(/\s+/g, "-") },
        { "title.en": { $regex: eventName, $options: "i" } },
      ],
    });

    if (!event) {
      return {
        reply:
          language === "hi"
            ? "इवेंट नहीं मिला"
            : "Event not found",
        actions: [],
      };
    }

    const priceInfo = event.ticketTypes
      .map(
        (t) =>
          `${t.label.en || t.label.hi}: ₹${t.price} (${t.taxPercent}% tax)`
      )
      .join("\n");

    return {
      reply:
        language === "hi"
          ? `${eventName} के लिए कीमतें:\n${priceInfo}`
          : `Prices for ${eventName}:\n${priceInfo}`,
      actions: [{ type: "book_button", payload: { event_id: event._id } }],
    };
  }

  private async handleAvailabilityQuery(intent: Intent, language: string): Promise<ChatReply> {
    const eventName = intent.entities.event;

    return {
      reply:
        language === "hi"
          ? `${eventName || "इवेंट"} की उपलब्धता जांचने के लिए एक क्षण रुकें...`
          : `Checking availability for ${eventName || "the event"}...`,
      actions: [{ type: "availability_check", payload: { event_name: eventName } }],
    };
  }

  private handleFAQ(intent: Intent, language: string): ChatReply {
    return {
      reply:
        language === "hi"
          ? "सामान्य प्रश्नों के लिए, कृपया हमारी नीति पृष्ठ देखें या सहायता के लिए हमसे संपर्क करें।"
          : "For frequently asked questions, please visit our FAQ page or contact support.",
      actions: [
        {
          type: "faq_buttons",
          payload: {
            items: [
              { label: "Refund Policy", value: "refund" },
              { label: "Cancellation", value: "cancellation" },
            ],
          },
        },
      ],
    };
  }

  private handleGreeting(language: string): ChatReply {
    return {
      reply:
        language === "hi"
          ? "नमस्ते! स्वागत है Prasthanam में। मैं आपको टिकट बुक करने में मदद करूंगा।"
          : "Hello! Welcome to Prasthanam. I'm here to help you book tickets.",
      actions: [
        {
          type: "quick_replies",
          payload: {
            items: [
              { label: "Browse Events", value: "browse" },
              { label: "Book Ticket", value: "book" },
            ],
          },
        },
      ],
    };
  }

  private handleFallback(language: string): ChatReply {
    return {
      reply:
        language === "hi"
          ? "मुझे समझ नहीं आया। क्या आप टिकट बुक करना चाहते हैं?"
          : "Sorry, I didn't understand. Would you like to book a ticket?",
      actions: [
        {
          type: "quick_replies",
          payload: {
            items: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
        },
      ],
    };
  }
}
