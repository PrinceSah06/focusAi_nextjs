import { NextResponse } from "next/server";

import { loginUserSchema } from "@/src/schema/auth.schema";

import { loginUser } from "@/src/services/auth.services";
import { accessTokenExpiresIn, expiresInToSeconds } from "@/src/utils/token.utils";

export async function POST(req: Request) {
  try {
    // parse request body
    const body = await req.json();

    // validate body
    const result = loginUserSchema.safeParse(body);

    // validation failed
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    // login user
    const { accessToken, refreshToken, refreshTokenMaxAge, user } =
      await loginUser(result.data);

    // success response
    const response = NextResponse.json(
      {
        message: "User logged in successfully",
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
        error: error instanceof Error ? error.message : "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
