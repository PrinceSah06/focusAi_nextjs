import type { Task } from "../../types";
import { useTaskStore } from "../../store/taskStore";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TaskCardProps = {
  task: Task;
};

const priorityStyles = {
  LOW: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-rose-50 text-rose-700",
};

const statusStyles = {
  TODO: "bg-zinc-100 text-zinc-700",
  IN_PROGRESS: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date: string | Date | null) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date instanceof Date ? date : new Date(date));
};

export default function TaskCard({ task }: TaskCardProps) {
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setEditingTask = useTaskStore((state) => state.setEditingTask);

  const deadline = formatDate(task.deadline);

  return (
    <Card className="transition hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{task.title}</CardTitle>

            {task.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <Badge className={priorityStyles[task.priority]}>
            {formatLabel(task.priority)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={statusStyles[task.status]}>
            {formatLabel(task.status)}
          </Badge>

          <Badge variant="outline">
            {deadline ? `Due ${deadline}` : "No deadline"}
          </Badge>

          <Badge variant="outline">
            {task.estimatedMinutes
              ? `${task.estimatedMinutes} min`
              : "No estimate"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {task.status !== "COMPLETED" && (
          <Button
            size="sm"
            onClick={() => completeTask(task.id)}
          >
            Complete
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setEditingTask(task)}
        >
          Edit
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}