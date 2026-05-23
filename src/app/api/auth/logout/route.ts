import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteTokenFromDb } from "@/src/services/auth.services";


export async function POST() {
  try {
    // 1. Initialize the cookie store (await is required in Next.js 15+)
    const cookieStore = await cookies();


    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      throw new Error("Token not found");
    }

    await deleteTokenFromDb(refreshToken.value);

    // const{token}= refreshToken

    // 2. Delete the cookies by their exact names
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken"); 

    // 3. Return a success response
    return NextResponse.json(
      { message: "User logged out successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
