import { create } from "zustand";
import { User } from "../types";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;

  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: true }),

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  logout: () => {
    set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  hydrateFromStorage: () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    if (accessToken && refreshToken) {
      set({
        accessToken,
        refreshToken,
        user: user ? JSON.parse(user) : null,
        isLoggedIn: true,
      });
    }
  },
}));
