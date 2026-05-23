import { NextRequest, NextResponse } from "next/server";

import { createTaskSchema } from "../../../schema/task.schema";
import { createTask, getAllTasks } from "../../../services/task.services";
import { verifyAuth } from "../../../utils/verify.auth";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const getErrorStatus = (error: unknown) => {
  if (!(error instanceof Error)) {
    return 500;
  }

  if (error.message === "Unauthorized" || error.message === "User not found") {
    return 401;
  }

  return 500;
};

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const body = await req.json();
    const result = createTaskSchema.safeParse(body);

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

    const task = await createTask(result.data, user.id);

    return NextResponse.json(
      {
        task,
        message: "success",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: getErrorMessage(error, "Something went wrong while creating task"),
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const tasks = await getAllTasks(user.id);

    return NextResponse.json(
      {
        tasks,
        message: "success",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return NextResponse.json(
      {
        error: getErrorMessage(error, "Something went wrong while fetching tasks"),
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}
