import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: Date;
  actions?: Array<{ type: string; payload: any }>;
}

interface ChatStore {
  sessionId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  language: string;

  initSession: () => void;
  addMessage: (from: "user" | "bot", text: string, actions?: Array<{ type: string; payload: any }>) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (lang: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  sessionId: uuidv4(),
  messages: [],
  isLoading: false,
  language: "en",

  initSession: () => {
    set({ sessionId: uuidv4(), messages: [] });
  },

  addMessage: (from, text, actions) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          from,
          text,
          timestamp: new Date(),
          actions,
        },
      ],
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setLanguage: (language) => set({ language }),

  clearChat: () => {
    set({ sessionId: uuidv4(), messages: [], isLoading: false });
  },
}));
