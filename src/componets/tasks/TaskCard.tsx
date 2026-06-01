"use client";

import type { Task } from "../../types";
import { useTaskStore } from "../../store/taskStore";

type TaskCardProps = {
  task: Task;
};

const priorityStyles = {
  LOW: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
  HIGH: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusStyles = {
  TODO: "bg-zinc-100 text-zinc-700",
  IN_PROGRESS: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date: string | null) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function TaskCard({ task }: TaskCardProps) {
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setEditingTask = useTaskStore((state) => state.setEditingTask);
  const deadline = formatDate(task.deadline);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-950">{task.title}</h2>
          {task.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
              {task.description}
            </p>
          )}
        </div>

        <span
          className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityStyles[task.priority]}`}
        >
          {formatLabel(task.priority)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-zinc-600 sm:grid-cols-3">
        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}>
          {formatLabel(task.status)}
        </span>
        <span>{deadline ? `Due ${deadline}` : "No deadline"}</span>
        <span>
          {task.estimatedMinutes ? `${task.estimatedMinutes} min` : "No estimate"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.status !== "COMPLETED" && (
          <button
            type="button"
            onClick={() => completeTask(task.id)}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Complete
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditingTask(task)}
          className="rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
