import { getTodayLog, incrementAiCount } from "@/src/services/ai.service";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
       return NextResponse.json(
  {
    message: "Unauthorized",
  },
  {
    status: 401,
  }
);
    }

    const todaylog = await getTodayLog(user.id);

    if (!todaylog) {
      return NextResponse.json({
        used: 0,
        limit: 5,
        remaining: 5,
      });
    }

    return NextResponse.json({
      used: todaylog.aiCallsUsed,
      limit: 5,
      remaining: 5 - todaylog.aiCallsUsed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
