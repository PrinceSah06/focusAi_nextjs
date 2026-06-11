"use client";
import React from "react";
import PageHeader from "@/components/PageHeader";
import Stats from "@/components/StatsCard";
import { dashboardStats } from "@/src/app/(dashboard)/demodata";
import { useTaskStore } from "@/src/store/taskStore";
import { Cormorant } from "next/font/google";

const page = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const totalMinutes = tasks.reduce(
    (sum, task) => sum + (task.estimatedMinutes || 0),
    0,
  );
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const focusHours = Math.round(totalMinutes / 60);
  return (
    <div>
      <PageHeader
        title="Statistics"
        description="Track your productivity and task progress"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stats id="0" title="Total Tasks" value={totalTasks} />
        <Stats id="1" title="Completed Tasks" value={completedTasks} />
        <Stats id="3" title="Pending Tasks" value={pendingTasks} />
        <Stats id="3" title="In Progress Tasks" value={inProgressTasks} />
        <Stats id="4" title="Focus Hours" value={focusHours} />
        <Stats id="5" title="Completion Rate " value={completionRate} />
      </div>
    </div>
  );
};

export default page;
