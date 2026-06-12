"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import TaskCard from "./TaskCard";

type TaskListProps = {
  search: string;
  filter: string;
};

export default function TaskList({
  search,
  filter,
}: TaskListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const token = useAuthStore((state) => state.token);
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && token) {
      fetchTasks();
    }
  }, [fetchTasks, isMounted, token]);

  const filteredTasks = tasks.filter((task) => {
  const matchesSearch =
    task.title
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesFilter =
    filter === "ALL"
      ? true
      : filter === "Todo"
      ? task.status === "TODO"
      : filter === "In Progress"
      ? task.status === "IN_PROGRESS"
      : task.status === "COMPLETED";

  return matchesSearch && matchesFilter;
});

  if (!isMounted) {
    return <div className="p-4">Loading tasks...</div>;
  }

  if (!token) {
    return <div className="p-4">Please log in to view your tasks.</div>;
  }

  return (
    <section className="space-y-4">
      {/* <div>
        <p className="text-sm font-medium text-sky-600">Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-950 sm:text-3xl">
          Your tasks
        </h1>
      </div> */}

      {isLoading && <p className="text-sm text-zinc-500">Loading tasks...</p>}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {!isLoading && filteredTasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-zinc-700">No tasks found</p>
          <p className="mt-1 text-sm text-zinc-500">
            Create a task from the form on the right.
          </p>
        </div>
      )}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
