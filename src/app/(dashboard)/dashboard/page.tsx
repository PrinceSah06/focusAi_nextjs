"use client";
import StatsCard from "@/components/StatsCard";
import TaskCard from "@/components/TaskCard";
import PageHeader from "@/components/PageHeader";
import SchedulePreview from "@/components/SchedulePreview";
import { useTaskStore } from "@/src/store/taskStore";
import { useEffect } from "react";
import { useGenTaskStore } from "@/src/store/aiGenrateStore";
const page = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const stats = useTaskStore((state) => state.stats);
  const isLoading = useTaskStore((state) => state.isLoading);

  const ai = useGenTaskStore((state) => state.ai);
  const fetchTodaySchedule = useGenTaskStore((state) => state.fetchTodaySchedule);
  const aiLoading = useGenTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchTodaySchedule();
  }, [fetchTodaySchedule]);

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, [fetchTasks, tasks.length]);

  if (isLoading || aiLoading) {
    return <p className="p-6 text-sm text-zinc-500">Loading dashboard...</p>;
  }




  return (
    <div className="mx-auto max-w-7xl py-6 px-6 space-y-8">
      {/* <MobileSidebar/> */}
      <PageHeader
        title="Dashboard"
        description="Welcome back, Prince. Here's today's productivity overview."
      />
      <PageHeader title="Stats" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard id="1" title="Total Tasks" value={stats.total} />
        <StatsCard id="2" title="Todo" value={stats.todo} />
        <StatsCard id="3" title="In Progress" value={stats.inProgress} />
        <StatsCard id="4" title="Completed" value={stats.completed} />
      </section>

      <PageHeader title="Tasks" description="AI-Generated Plan for your day" />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks
            .slice(0, 6)
            .map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                priority={task.priority}
                status={task.status}
                deadline={task.deadline}
              />
            ))
        )}
      </section>
      <PageHeader title="Preview" description="Task preview  form ai" />
<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  {ai.length === 0 ? (
    <p>No schedule generated yet.</p>
  ) : (
    ai.map((task) => (
      <SchedulePreview
        end={task.end}
       energy={task.energyRequired}
        start={task.start}
        taskTitle={task.taskTitle}
        key={task.taskTitle}
      />
    ))
  )}
</section>
    </div>
  );
};

export default page;
