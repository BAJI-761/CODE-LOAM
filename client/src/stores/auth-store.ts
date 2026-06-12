import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Default to loading state until initialized

    login: (token, user) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    setUser: (user) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    },

    setLoading: (isLoading) => {
      set({ isLoading });
    },
  }))
);
