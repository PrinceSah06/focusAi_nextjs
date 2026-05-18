import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma";

import type { RegisterInput } from "../schema/auth.schema";

export const createUser = async (
  data: RegisterInput
) => {
  const { name, email, password } = data;

  // 1. check existing user
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. hash password
  const hashedPassword =
    await bcrypt.hash(password, 10);

  // 3. create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 4. return safe user
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};