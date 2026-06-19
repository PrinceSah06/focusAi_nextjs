import { prisma } from "../lib/prisma";
import {getAllTasks} from "@/src/services/task.services"


export const calculateProductivityScore = (
  completed: number,
  missed: number
) => {
  const total = completed + missed;

  if (total === 0) return 0;

  return Math.round(
    (completed / total) * 100
  );
};export const getProductivityStats = async (
  userId: string
) => {
  const allTasks = await getAllTasks(userId);

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(
    task => task.status === "COMPLETED"
  ).length;

  const pendingTasks = allTasks.filter(
    task => task.status !== "COMPLETED"
  ).length;

  const score = calculateProductivityScore(
    completedTasks,
    pendingTasks
  );

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    score,
  };
};