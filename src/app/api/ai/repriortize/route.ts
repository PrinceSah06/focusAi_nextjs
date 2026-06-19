import {
  incrementAiCount,
} from "@/src/services/ai.service";
import { getAllTasks } from "@/src/services/task.services";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";
import { runAI } from "@/src/lib/groqAI";
import { buildReprioritizePrompt,reprioritizeSchema } from "@/src/lib/prompts/reprioritizePrompt";

export  async function POST(req:NextRequest) {
try {
    
        const user = await verifyAuth(req);
    
    
          if (!user) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
    
        const allTask = await getAllTasks(user.id)
    
        const unfinshedTask = allTask.filter((a) => a.status !== "COMPLETED")
    
    
        const prompt = buildReprioritizePrompt(unfinshedTask);
    
        const  aiResponse =  await runAI(prompt)
    
        const result = reprioritizeSchema.safeParse(aiResponse);
    
    
    
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
          message: "Repriortize  generated successfully",
          data: result.data,
        });
    
} catch (error) {
    return NextResponse.json(
      { message: "Failed to generate summary" },
      { status: 500 },
    );
}

    
}
