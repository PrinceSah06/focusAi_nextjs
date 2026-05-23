import { NextRequest } from "next/server";

import { verifyAccessToken } from "@/src/utils/token.utils";
import { prisma } from "@/src/lib/prisma";

export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}