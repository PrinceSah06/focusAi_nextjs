import { number } from "zod";

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type Task = {
  id: string
  userId: string
  title: string
  description: string | null
  deadline: string | null | Date
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  energyRequired: number | null
  estimatedMinutes: number | null
  updatedAt: string | Date
}

export type GeneratedScheduleItem = {
  start: string;
  end: string;
  taskTitle: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  energyRequired: number |string;
  notes?: string;
}; 

export type GenerateScheduleResponse = {
  message: string
  task: Task[]
  ai: GeneratedScheduleItem[]
}

export type CreateTaskInput = {
  title: string
  description?: string | null
  deadline?: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED"
  energyRequired?: number | null
  estimatedMinutes?: number | null
}

export type DailyLog = {
  id: string
  userId: string
  date: string
  tasksCompleted: number
  tasksMissed: number
  productivityScore: number
  aiFeedback: string | null
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

// ApiResponse<User>
// ApiResponse<Task[]>
// ApiResponse<DailyLog>
// ApiResponse<string>
