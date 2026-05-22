import { type NextRequest, NextResponse } from "next/server";

import { verifyUserInDb } from "@/src/services/auth.services";
import { verifyAccessToken } from "@/src/utils/token.utils";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;
    const cookieToken = req.cookies.get("accessToken")?.value;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized user",
        },
        {
          status: 401,
        },
      );
    }

    const { email, userId } = verifyAccessToken(token);
    const user = await verifyUserInDb(email, userId);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid user",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      {
        status: 401,
      },
    );
  }
}
