import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
interface TaskCardProps {
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  deadline?: string | any;
}
const TaskCard = (data: TaskCardProps) => {
  const { priority, status, title, deadline } = data;

  const priorityClass = () => {
    if (priority === "LOW") {
      return "text-green-400 bg-green-100";
    } else if (priority === "HIGH") {
      return "text-red-700 bg-red-100";
    } else {
      return "text-orange-500 bg-orange-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <Badge className={`${priorityClass()}`}>{priority}</Badge>
          <Badge>{status}</Badge>
        </div>

        <p>Deadline: {deadline ?? "No deadline"}</p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
