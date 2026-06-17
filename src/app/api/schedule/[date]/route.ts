import { getUserSchedul } from "@/src/services/ai.service";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
){

    const user = await verifyAuth(req);

    const { date } = await params;

        if(!user){
        return NextResponse.json('Invalid User')
    }
    const userSchedule = await getUserSchedul(user.id,date || undefined);

    if (!userSchedule) {
        return NextResponse.json({ message: "No schedule found for today" }, { status: 404 });
    }

    return NextResponse.json(userSchedule);
}