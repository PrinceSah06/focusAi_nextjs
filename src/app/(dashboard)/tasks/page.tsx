"use client";
import TaskList from "../../../componets/tasks/TaskList";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TaskForm from "../../../componets/tasks/TaskForm";
const page = () => {
  const buttonList = ["ALL", "Todo", "In Progress", "Completed"];
  return (
 <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">

  {/* Left Side */}
  <div className="space-y-6">
    <PageHeader
      title="Tasks"
      description="Manage and track your work"
    />

    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          className="max-w-md"
          placeholder="Search tasks..."
        />

        <Button>
          + New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {buttonList.map((item) => (
          <Button
            key={item}
            variant="outline"
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TaskList />
      </div>
    </div>
  </div>

  {/* Right Side */}
  <div>
    <TaskForm />
  </div>

</div>
  );
};

export default page;
