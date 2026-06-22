"use client";

import { create } from "zustand";
import axios from "axios";

import { api } from "../lib/axios";
import type { User } from "../types";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  user: User;
  accessToken: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<User>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const savedToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: savedToken,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<LoginResponse>("/auth/login", data);

      localStorage.setItem("accessToken", response.data.accessToken);

      set({
        user: response.data.user,
        token: response.data.accessToken,
        isLoading: false,
      });

      return response.data.user;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Login failed"
        : "Login failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  fetchMe: async () => {
    const savedToken = localStorage.getItem("accessToken");
    if (!savedToken) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ user: User }>("/auth/me");
      set({
        user: response.data.user,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Failed to load user profile",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },
}));
