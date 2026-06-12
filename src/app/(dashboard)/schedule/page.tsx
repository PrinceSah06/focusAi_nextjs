"use client";

import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import SchedulePreview from "@/components/SchedulePreview";
import StatsCard from "@/components/StatsCard";
import { useGenTaskStore } from "@/src/store/aiGenrateStore";
const page = () => {
  const ai = useGenTaskStore((state) => state.ai);
  const generateSchedule = useGenTaskStore((state) => state.generateSchedule);
  const isLoading = useGenTaskStore((state) => state.isLoading);

  useEffect(() => {
    generateSchedule();
  }, [generateSchedule]);
  const highPriorityTasks = ai.filter(
    (task) => task.priority === "HIGH",
  ).length;
  if (isLoading) {
    return <p>Generating schedule...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Schedule"
        description="AI-generated plan for your day"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard id="0" title="Total Blocks" value={ai.length} />

        <StatsCard id="1" title="Focus Blocks" value={ai.length} />

        <StatsCard id="2" title="High Priority" value={highPriorityTasks} />

        <StatsCard id="3" title="Tasks Scheduled" value={ai.length} />
      </section>
      <h2 className="text-lg font-semibold py-4">Time Blocks</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ai.length === 0 ? (
          <p>No schedule generated yet.</p>
        ) : (
          ai.map((task) => (
            <SchedulePreview
              end={task.end}
              energy={task.priority}
              start={task.start}
              taskTitle={task.taskTitle}
              key={task.taskTitle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default page;
