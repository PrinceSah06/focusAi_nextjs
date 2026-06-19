import { prisma } from "../lib/prisma";

import type { CreateTaskInput, UpdateTaskInput } from "../schema/task.schema";

export const createTask = async (data: CreateTaskInput, userId: string) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      userId,
      description: data.description,
      priority: data.priority,
      status: data.status,
      energyRequired: data.energyRequired,
      estimatedMinutes: data.estimatedMinutes,
      deadline: data.deadline,
    },
  });

  return task;
};

export const getAllTasks = async (userId: string) => {
  const allTasks = await prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return allTasks;
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTaskById = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) => {
  await getTaskById(userId, taskId);

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });

  return task;
};

export const deleteTaskById = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return true;
};


