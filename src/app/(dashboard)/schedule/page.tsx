"use client";

import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import SchedulePreview from "@/components/SchedulePreview";
import StatsCard from "@/components/StatsCard";
import { useGenTaskStore } from "@/src/store/aiGenrateStore";
const page = () => {
  const ai = useGenTaskStore((state) => state.ai);
  const fetchTodaySchedule = useGenTaskStore((state) => state.fetchTodaySchedule);
  const generateSchedule = useGenTaskStore((state) => state.generateSchedule);
  const isLoading = useGenTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchTodaySchedule();
  }, [fetchTodaySchedule]);

  const highPriorityTasks = ai.filter(
    (task) => task.priority === "HIGH",
  ).length;

  if (isLoading) {
    return <p className="p-6 text-sm text-zinc-500">Processing schedule with AI...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Today's Schedule"
          description="AI-generated plan for your day"
        />
        {ai.length > 0 && (
          <button
            onClick={() => generateSchedule()}
            disabled={isLoading}
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition disabled:bg-sky-400"
          >
            Regenerate with AI
          </button>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard id="0" title="Total Blocks" value={ai.length} />

        <StatsCard id="1" title="Focus Blocks" value={ai.length} />

        <StatsCard id="2" title="High Priority" value={highPriorityTasks} />

        <StatsCard id="3" title="Tasks Scheduled" value={ai.length} />
      </section>

      <h2 className="text-lg font-semibold py-4">Time Blocks</h2>

      {ai.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
          <div className="grid size-12 place-items-center rounded-full bg-sky-50 text-sky-600">
            <span className="text-xl font-bold">AI</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900">No schedule generated yet</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Let FocusAI analyze your tasks and build an optimized chronological plan for your day.
          </p>
          <button
            onClick={() => generateSchedule()}
            className="mt-6 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition"
          >
            Generate Daily Schedule
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ai.map((task) => (
            <SchedulePreview
              end={task.end}
              energy={task.priority}
              start={task.start}
              taskTitle={task.taskTitle}
              key={task.taskTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
