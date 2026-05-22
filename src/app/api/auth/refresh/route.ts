import { type NextRequest, NextResponse } from "next/server";

import { refreshAuthSession } from "@/src/services/auth.services";
import { accessTokenExpiresIn, expiresInToSeconds } from "@/src/utils/token.utils";

export async function POST(req: NextRequest) {
  try {
    const oldRefreshToken = req.cookies.get("refreshToken")?.value;

    if (!oldRefreshToken) {
      return NextResponse.json(
        {
          error: "Refresh token missing",
        },
        {
          status: 401,
        },
      );
    }

    const { accessToken, refreshToken, refreshTokenMaxAge, user } =
      await refreshAuthSession(oldRefreshToken);

    const response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        user,
        accessToken,
      },
      {
        status: 200,
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: expiresInToSeconds(accessTokenExpiresIn, 15 * 60),
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: refreshTokenMaxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid refresh token",
      },
      {
        status: 401,
      },
    );
  }
}
