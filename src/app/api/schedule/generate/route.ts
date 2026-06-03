import main from "@/src/lib/groqAI";
import { getAllTasks } from "@/src/services/task.services";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    const allTask = await getAllTasks(user.id);
    const ai = await main(allTask);

    return NextResponse.json({
      message: "schedule generated",
      task: allTask,
      ai,
    });
  } catch (error) {
    console.log("error while passing data ai [gen/route.ts]", error);

    return NextResponse.json({
      message: "false",
      error,
    });
  }
}
