"use client";

import { type FormEvent, useEffect, useState } from "react";

import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import type { CreateTaskInput } from "../../types";
import {CardAction,Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger , SelectContent,SelectItem,SelectScrollDownButton,SelectValue,} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

const formatDateTimeLocal = (date: string | Date | null) => {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 16);
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
      deadline: formatDateTimeLocal(editingTask.deadline),
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

    <h2 className="mt-1 text-2xl font-semibold">
      {editingTask ? "Edit Task" : "Create Task"}
    </h2>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>
        {editingTask ? "Edit Task" : "Create Task"}
      </CardTitle>

      <CardDescription>
        Create and manage your tasks
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form
        onSubmit={handleCreateTask}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Title */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium">
            Title
          </label>

          <Input
            value={form.title}
            onChange={(e) =>
              updateForm("title", e.target.value)
            }
            placeholder="Write task title"
            required
          />
        </div>

        {/* Description */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <Textarea
            value={form.description}
            onChange={(e) =>
              updateForm("description", e.target.value)
            }
            placeholder="Add notes..."
          />
        </div>

        {/* Priority */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Priority
          </label>

          <Select
            value={form.priority}
            onValueChange={(value) =>
              updateForm("priority", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LOW">
                Low
              </SelectItem>

              <SelectItem value="MEDIUM">
                Medium
              </SelectItem>

              <SelectItem value="HIGH">
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Status
          </label>

          <Select
            value={form.status}
            onValueChange={(value) =>
              updateForm("status", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="TODO">
                Todo
              </SelectItem>

              <SelectItem value="IN_PROGRESS">
                In Progress
              </SelectItem>

              <SelectItem value="COMPLETED">
                Completed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deadline */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Deadline
          </label>

          <Input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) =>
              updateForm("deadline", e.target.value)
            }
          />
        </div>

        {/* Energy Required */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Energy Required
          </label>

          <Input
            type="number"
            min={1}
            max={5}
            value={form.energyRequired}
            onChange={(e) =>
              updateForm(
                "energyRequired",
                e.target.value
              )
            }
            placeholder="1 - 5"
          />
        </div>

        {/* Estimated Minutes */}
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-medium">
            Estimated Minutes
          </label>

          <Input
            type="number"
            min={1}
            value={form.estimatedMinutes}
            onChange={(e) =>
              updateForm(
                "estimatedMinutes",
                e.target.value
              )
            }
            placeholder="Example: 45"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 md:col-span-2">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 md:col-span-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading
              ? editingTask
                ? "Updating..."
                : "Creating..."
              : editingTask
              ? "Update Task"
              : "Create Task"}
          </Button>

          {editingTask && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                clearEditingTask();
                setForm(initialFormState);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </CardContent>
  </Card>
</section>

  );
}
