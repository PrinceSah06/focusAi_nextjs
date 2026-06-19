import {
  getUserSchedul,
  getTodayLog,
  incrementAiCount,
} from "@/src/services/ai.service";
import { getAllTasks } from "@/src/services/task.services";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";
import { buildSummaryPrompt } from "@/src/lib/prompts/summaryPrompt";
import { runAI } from "@/src/lib/groqAI";
import { dailySummarySchema } from "@/src/schema/aiResponse.schema";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const task = await getAllTasks(user.id);
    const schedule = await getUserSchedul(user.id);
    const dailyLog = await getTodayLog(user.id);

    const prompt = buildSummaryPrompt(task, dailyLog, schedule);

    const aiResponse = await runAI(prompt);

    const result = dailySummarySchema.safeParse(aiResponse);

    
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid AI response",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }
      await incrementAiCount(user.id);

    return NextResponse.json({
      message: "Summary generated successfully",
      data: result.data,
    });
  } catch (error) {
   return NextResponse.json(
  { message: "Failed to reprioritize tasks" },
  { status: 500 }
);
  }
}
