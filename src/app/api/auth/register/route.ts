import { NextResponse } from "next/server";

import { registerUserSchema } from "@/src/schema/auth.schema";

import { createUser } from "@/src/services/auth.services";

export async function POST(req: Request) {
  try {
    // parse request body
    const body = await req.json();

    // validate body
    const result = registerUserSchema.safeParse(body);

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

    // create user
    const user = await createUser(result.data);

    // success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      {
        status: 201,
      },
    );
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
