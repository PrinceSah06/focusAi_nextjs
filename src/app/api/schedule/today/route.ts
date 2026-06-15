import { getUserSchedul } from "@/src/services/ai.service";
import { verifyAuth } from "@/src/utils/verify.auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest){

    const user = await verifyAuth(req);

    if(!user){
        return NextResponse.json('Invalid User')
    }
    const userSchedule = await getUserSchedul(user.id);

    if (!userSchedule) {
        return NextResponse.json({ message: "No schedule found for today" }, { status: 404 });
    }

    return NextResponse.json(userSchedule);
}