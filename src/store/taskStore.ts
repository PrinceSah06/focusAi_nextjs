"use client";

import { create } from "zustand";
import axios from "axios";

import { api } from "../lib/axios";
import type { CreateTaskInput, Task } from "../types";

type TaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
};

type TaskState = {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
};

type TasksResponse = {
  tasks: Task[];
  message: string;
};

type TaskResponse = {
  task: Task;
  message: string;
};

const emptyStats: TaskStats = {
  total: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
};

const getStats = (tasks: Task[]): TaskStats => ({
  total: tasks.length,
  todo: tasks.filter((task) => task.status === "TODO").length,
  inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
  completed: tasks.filter((task) => task.status === "COMPLETED").length,
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || fallback;
  }

  return fallback;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  stats: emptyStats,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<TasksResponse>("/task");
      const tasks = response.data.tasks;

      set({
        tasks,
        stats: getStats(tasks),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch tasks"),
        isLoading: false,
      });
    }
  },

  addTask: async (task) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<TaskResponse>("/task", task);
      const tasks = [response.data.task, ...get().tasks];

      set({
        tasks,
        stats: getStats(tasks),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to add task"),
        isLoading: false,
      });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.patch<TaskResponse>(`/task/${id}`, updates);
      const tasks = get().tasks.map((task) =>
        task.id === id ? response.data.task : task,
      );

      set({
        tasks,
        stats: getStats(tasks),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to update task"),
        isLoading: false,
      });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await api.delete(`/task/${id}`);
      const tasks = get().tasks.filter((task) => task.id !== id);

      set({
        tasks,
        stats: getStats(tasks),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to delete task"),
        isLoading: false,
      });
    }
  },

  completeTask: async (id) => {
    await get().updateTask(id, { status: "COMPLETED" });
  },
}));
