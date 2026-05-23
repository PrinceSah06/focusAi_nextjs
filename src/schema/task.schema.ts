import { z } from "zod";
import { Priority, Status } from "../../app/generated/prisma/enums";

// ==============================
// CREATE TASK SCHEMA
// ==============================
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),

  priority: z
    .nativeEnum(Priority)
    .default(Priority.MEDIUM),

  status: z
    .nativeEnum(Status)
    .default(Status.TODO),

  energyRequired: z
    .number()
    .int()
    .min(1)
    .max(5)
    .nullable()
    .optional(),

  estimatedMinutes: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),

  deadline: z
    .coerce
    .date()
    .nullable()
    .optional(),
});

// ==============================
// UPDATE TASK SCHEMA
// all fields optional
// ==============================
export const updateTaskSchema =
  createTaskSchema.partial();

// ==============================
// TYPES
// ==============================
export type CreateTaskInput =
  z.infer<typeof createTaskSchema>;

export type UpdateTaskInput =
  z.infer<typeof updateTaskSchema>;
