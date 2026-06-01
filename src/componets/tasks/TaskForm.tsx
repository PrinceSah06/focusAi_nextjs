"use client";

import { type FormEvent, useEffect, useState } from "react";

import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import type { CreateTaskInput } from "../../types";

type TaskFormState = {
  title: string;
  description: string;
  deadline: string;
  priority: CreateTaskInput["priority"];
  status: CreateTaskInput["status"];
  energyRequired: string;
  estimatedMinutes: string;
};

const initialFormState: TaskFormState = {
  title: "",
  description: "",
  deadline: "",
  priority: "MEDIUM",
  status: "TODO",
  energyRequired: "",
  estimatedMinutes: "",
};

export default function TaskForm() {
  const [form, setForm] = useState<TaskFormState>(initialFormState);
  const [isMounted, setIsMounted] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const editingTask = useTaskStore((state) => state.editingTask);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const clearEditingTask = useTaskStore((state) => state.clearEditingTask);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  
  useEffect(() => {
    if (!editingTask) {
      setForm(initialFormState);
      return;
    }

    setForm({
      title: editingTask.title,
      description: editingTask.description || "",
      deadline: editingTask.deadline || "",
      priority: editingTask.priority,
      status: editingTask.status,
      energyRequired: editingTask.energyRequired?.toString() || "",
      estimatedMinutes: editingTask.estimatedMinutes?.toString() || "",
    });
  }, [editingTask]);
  if (!isMounted) {
    return <div className="p-4">Loading application layout...</div>;
  }

  if (!token) {
    return <div className="p-4">Please log in to view your tasks.</div>;
  }


  const updateForm = (field: keyof TaskFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const updates: CreateTaskInput = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      deadline: form.deadline || undefined,
      priority: form.priority,
      status: form.status,
      energyRequired: form.energyRequired
        ? Number(form.energyRequired)
        : null,
      estimatedMinutes: form.estimatedMinutes
        ? Number(form.estimatedMinutes)
        : null,
    };

    if (editingTask) {
      await updateTask(editingTask.id, updates);
      clearEditingTask();
    } else {
      await addTask(updates);
    }

    setForm(initialFormState);
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-sm font-medium text-sky-600">
          Welcome, {user?.name || "User"}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-zinc-950 sm:text-2xl">
          {editingTask ? "Edit task" : "Create a detailed task"}
        </h2>
      </div>

      <form
        onSubmit={handleCreateTask}
        className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
      >
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-800">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            placeholder="Write the task title"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            minLength={3}
            maxLength={100}
            required
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-800">
            Description
          </span>
          <textarea
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Add notes, context, or acceptance details"
            className="min-h-28 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            maxLength={1000}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-800">Priority</span>
          <select
            value={form.priority}
            onChange={(e) => updateForm("priority", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-800">Status</span>
          <select
            value={form.status}
            onChange={(e) => updateForm("status", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-800">Deadline</span>
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => updateForm("deadline", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-800">
            Energy required
          </span>
          <input
            type="number"
            value={form.energyRequired}
            onChange={(e) => updateForm("energyRequired", e.target.value)}
            placeholder="1 to 5"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            min={1}
            max={5}
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-800">
            Estimated minutes
          </span>
          <input
            type="number"
            value={form.estimatedMinutes}
            onChange={(e) => updateForm("estimatedMinutes", e.target.value)}
            placeholder="Example: 45"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            min={1}
          />
        </label>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isLoading
              ? editingTask
                ? "Updating..."
                : "Creating..."
              : editingTask
              ? "Update task"
              : "Create task"}
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={() => {
                clearEditingTask();
                setForm(initialFormState);
              }}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
