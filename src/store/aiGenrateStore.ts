"use client";

import axios from "axios";
import { create } from "zustand";

import { api } from "../lib/axios";
import type {
  GenerateScheduleResponse,
  GeneratedScheduleItem,
  Task,
} from "../types";

type AiUsage = {
  used: number;
  limit: number;
  remaining: number;
};

type DailySummary = {
  summary: string;
  productivityLevel: "LOW" | "MEDIUM" | "HIGH";
  suggestion: string;
};

type ReprioritizeItem = {
  title: string;
  newPriority: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
};

type AiGenerateState = {
  tasks: Task[];
  ai: GeneratedScheduleItem[];
  aiUsage: AiUsage | null;
  dailySummary: DailySummary | null;
  reprioritizeList: ReprioritizeItem[] | null;
  isLoading: boolean;
  error: string | null;
  generateSchedule: () => Promise<void>;
  fetchTodaySchedule: () => Promise<void>;
  fetchAiUsage: () => Promise<void>;
  generateDailySummary: () => Promise<void>;
  generateReprioritize: () => Promise<void>;
  clearSchedule: () => void;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const responseError = error.response?.data?.error;
    return typeof responseError === "string" ? responseError : fallback;
  }

  return fallback;
};

export const useGenTaskStore = create<AiGenerateState>((set) => ({
  tasks: [],
  ai: [],
  aiUsage: null,
  dailySummary: null,
  reprioritizeList: null,
  isLoading: false,
  error: null,

  generateSchedule: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<GenerateScheduleResponse>(
        "/schedule/generate",
      );

      set({
        ai: response.data.ai,
        isLoading: false,
      });
      
      // Refresh usage stats
      const usageRes = await api.get<AiUsage>("/ai/usage");
      set({ aiUsage: usageRes.data });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to generate schedule"),
        isLoading: false,
      });
    }
  },

  fetchTodaySchedule: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<any>("/schedule/today");
      set({
        ai: response.data.blocks || [],
        isLoading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        set({
          ai: [],
          isLoading: false,
          error: null,
        });
        return;
      }
      set({
        error: getErrorMessage(error, "Failed to fetch today's schedule"),
        isLoading: false,
      });
    }
  },

  fetchAiUsage: async () => {
    try {
      const response = await api.get<AiUsage>("/ai/usage");
      set({ aiUsage: response.data });
    } catch (error) {
      console.error("Failed to fetch AI usage:", error);
    }
  },

  generateDailySummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ message: string; data: DailySummary }>("/ai/daily-summary");
      set({
        dailySummary: response.data.data,
        isLoading: false,
      });
      // Refresh usage stats
      const usageRes = await api.get<AiUsage>("/ai/usage");
      set({ aiUsage: usageRes.data });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to generate daily summary"),
        isLoading: false,
      });
    }
  },

  generateReprioritize: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ message: string; data: { tasks: ReprioritizeItem[] } }>("/ai/repriortize");
      set({
        reprioritizeList: response.data.data.tasks,
        isLoading: false,
      });
      // Refresh usage stats
      const usageRes = await api.get<AiUsage>("/ai/usage");
      set({ aiUsage: usageRes.data });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to generate reprioritization list"),
        isLoading: false,
      });
    }
  },

  clearSchedule: () => {
    set({ tasks: [], ai: [], aiUsage: null, dailySummary: null, reprioritizeList: null, error: null });
  },
}));
