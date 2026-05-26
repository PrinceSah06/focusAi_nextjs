import { NextRequest, NextResponse } from "next/server";

import { updateTaskSchema } from "@/src/schema/task.schema";
import {
  deleteTaskById,
  getTaskById,
  updateTaskById,
} from "../../../../services/task.services";
import { verifyAuth } from "../../../../utils/verify.auth";

type TaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const getErrorStatus = (error: unknown) => {
  if (!(error instanceof Error)) {
    return 500;
  }

  if (error.message === "Unauthorized" || error.message === "User not found") {
    return 401;
  }

  if (error.message === "Task not found") {
    return 404;
  }

  return 500;
};

export async function GET(req: NextRequest, { params }: TaskRouteContext) {
  try {
    const user = await verifyAuth(req);
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        {
          error: "Missing task id",
        },
        {
          status: 400,
        },
      );
    }

    const task = await getTaskById(user.id, taskId);

    return NextResponse.json(
      {
        message: "success",
        task,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    return NextResponse.json(
      {
        error: getErrorMessage(error, "Something went wrong while fetching task"),
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: TaskRouteContext) {
  try {
    const user = await verifyAuth(req);
    const body = await req.json();
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid task data",
          details: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        {
          error: "Missing task id",
        },
        {
          status: 400,
        },
      );
    }

    const task = await updateTaskById(user.id, taskId, result.data);

    return NextResponse.json(
      {
        message: "success",
        task,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: getErrorMessage(error, "Something went wrong while updating task"),
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: TaskRouteContext) {
  try {
    const user = await verifyAuth(req);
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        {
          error: "Missing task id",
        },
        {
          status: 400,
        },
      );
    }

    await deleteTaskById(user.id, taskId);

    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: getErrorMessage(error, "Something went wrong while deleting task"),
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}
