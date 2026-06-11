import PageHeader from "@/components/PageHeader";
import React from "react";
import { mockSchedule } from "@/src/app/(dashboard)/demodata";
import SchedulePreview from "@/components/SchedulePreview";
import StatsCard from "@/components/StatsCard";
const page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Schedule"
        description="AI-generated plan for your day"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard id="0" title="Total Blocks" value={mockSchedule.length} />

        <StatsCard id="1" title="Focus Time" value={4} description="hours" />

        <StatsCard id="2" title="High Energy" value={2} />


        <StatsCard
  id="3"
  title="Tasks Scheduled"
  value={mockSchedule.length}
/>
      </section>
      <h2 className="text-lg font-semibold py-4">Time Blocks</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockSchedule.map((task) => (
          <SchedulePreview
            end={task.end}
            energy={task.energy}
            start={task.start}
            taskTitle={task.taskTitle}
            key={task.taskTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
