// types/index.ts

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  deadline?: string;
  estimatedMinutes?: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
}

export interface Stat {
  id: string;
  title: string;
  value: string | number;
  description?: string;
}

export const dashboardStats: DashboardStats = {
  totalTasks: 12,
  completedTasks: 8,
  pendingTasks: 4,
  productivityScore: 78,
};

export const mockStats: Stat[] = [
  {
    id: "total-tasks",
    title: " 📋 Total  Tasks",
    value: dashboardStats.totalTasks,
    description: "All tasks in your workspace",
  },
  {
    id: " ✅ completed-tasks",
    title: " ✅ Completed",
    value: dashboardStats.completedTasks,
    description: "Tasks already finished",
  },
  {
    id: "  pending-tasks",
    title: " ⏳ Pending",
    value: dashboardStats.pendingTasks,
    description: "Tasks still waiting",
  },
  {
    id: " productivity-score",
    title: " 📈Productivity",
    value: `${dashboardStats.productivityScore}%`,
    description: "Demo focus score",
  },
];

export interface TimeBlock {
  start: string;
  end: string;
  taskTitle: string;
  energy: string |number 
}

export const mockSchedule: TimeBlock[] = [
  {
    start: "09:00",
    end: "10:30",
    taskTitle: "Build Authentication",
    energy: "HIGH",
  },
  {
    start: "11:00",
    end: "12:00",
    taskTitle: "Dashboard UI",
    energy: "MEDIUM",
  },
  {
    start: "14:00",
    end: "15:00",
    taskTitle: "Tailwind Practice",
    energy: "LOW",
  },
];
// import { Task } from "@/types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Build Authentication",
    priority: "HIGH",
    status: "IN_PROGRESS",
    deadline: "2026-06-10",
    estimatedMinutes: 120,
  },
  {
    id: "2",
    title: "Create Dashboard UI",
    priority: "MEDIUM",
    status: "TODO",
    deadline: "2026-06-11",
    estimatedMinutes: 90,
  },
  {
    id: "3",
    title: "Learn Tailwind Flexbox",
    priority: "LOW",
    status: "COMPLETED",
    deadline: "2026-06-09",
    estimatedMinutes: 45,
  },
];

export const mockUser = {
  id: "user-1",
  name: "Prince Sah",
  email: "prince@example.com",
};


