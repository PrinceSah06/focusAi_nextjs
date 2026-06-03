"use client";

import axios from "axios";
import { create } from "zustand";

import { api } from "../lib/axios";
import type {
  GenerateScheduleResponse,
  GeneratedScheduleItem,
  Task,
} from "../types";

type AiGenerateState = {
  tasks: Task[];
  ai: GeneratedScheduleItem[];
  isLoading: boolean;
  error: string | null;
  generateSchedule: () => Promise<void>;
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
  isLoading: false,
  error: null,

  generateSchedule: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<GenerateScheduleResponse>(
        "/schedule/generate",
      );

      set({
        tasks: response.data.task,
        ai: response.data.ai,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to generate schedule"),
        isLoading: false,
      });
    }
  },

  clearSchedule: () => {
    set({ tasks: [], ai: [], error: null });
  },
}));
