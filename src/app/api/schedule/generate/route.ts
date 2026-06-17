import { runAI } from "@/src/lib/groqAI";
import {
  incrementAiCount,
  storeInSchedulDb,
  taskFromSchedulDB,
} from "@/src/services/ai.service";
import { getAllTasks } from "@/src/services/task.services";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";
import ca from "zod/v4/locales/ca.cjs";
import { buildSchedulePrompt } from "@/src/lib/prompts/schedulePrompt";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const allTask = await getAllTasks(user.id);

    const prompt = buildSchedulePrompt(allTask);
    const ai = await runAI(prompt);
    await incrementAiCount(user.id);

    await incrementAiCount(user.id);
    await storeInSchedulDb(user.id, ai);

    return NextResponse.json({
      message: "schedule generated",

      ai,
    });
  } catch (error) {
    console.log("error while passing data ai [gen/route.ts]", error);

    return NextResponse.json(
      {
        message: "Failed to generate schedule",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    const schedules = await taskFromSchedulDB(user.id);

    return NextResponse.json({
      schedules,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 },
    );
  }
}
