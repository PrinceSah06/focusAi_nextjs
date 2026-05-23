import bcrypt from "bcryptjs";
import { createHash } from "crypto";

import { prisma } from "../lib/prisma";

import type { LoginInput, RegisterInput } from "../schema/auth.schema";
import {
  expiresInToSeconds,
  generateAccessToken,
  generateRefreshToken,
  refreshTokenExpiresIn,
  verifyRefreshToken,
} from "../utils/token.utils";

const safeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const createUser = async (
  data: RegisterInput,
) => {
  const { name, email, password } = data;

  // 1. check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 4. return safe user
  return safeUser(user);
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const verifyPassword = await bcrypt.compare(password, existingUser.password);

  if (!verifyPassword) {
    throw new Error("Invalid credentials");
  }

  const tokenPayload = {
    userId: existingUser.id,
    email: existingUser.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const refreshTokenMaxAge = expiresInToSeconds(
    refreshTokenExpiresIn,
    7 * 24 * 60 * 60,
  );

  await prisma.refreshToken.create({
    data: {
      userId: existingUser.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshTokenMaxAge * 1000),
    },
  });

  return {
    user: safeUser(existingUser),
    accessToken,
    refreshToken,
    refreshTokenMaxAge,
  };
};

export const refreshAuthSession = async (oldRefreshToken: string) => {
  const payload = verifyRefreshToken(oldRefreshToken);
  const oldTokenHash = hashToken(oldRefreshToken);

  const savedRefreshToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: oldTokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!savedRefreshToken) {
    throw new Error("Invalid refresh token");
  }

  if (savedRefreshToken.expiresAt.getTime() < Date.now()) {
    await prisma.refreshToken.delete({
      where: {
        id: savedRefreshToken.id,
      },
    });

    throw new Error("Refresh token expired");
  }

  if (
    savedRefreshToken.userId !== payload.userId ||
    savedRefreshToken.user.email !== payload.email
  ) {
    throw new Error("Invalid refresh token");
  }

  const tokenPayload = {
    userId: savedRefreshToken.user.id,
    email: savedRefreshToken.user.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const refreshTokenMaxAge = expiresInToSeconds(
    refreshTokenExpiresIn,
    7 * 24 * 60 * 60,
  );

  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: savedRefreshToken.id,
      },
    }),
    prisma.refreshToken.create({
      data: {
        userId: savedRefreshToken.user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshTokenMaxAge * 1000),
      },
    }),
  ]);

  return {
    user: safeUser(savedRefreshToken.user),
    accessToken,
    refreshToken,
    refreshTokenMaxAge,
  };
};


export const deleteTokenFromDb = async (rawToken: string) => {
  const tokenHash = hashToken(rawToken);

  const deletedToken = await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });

  if (deletedToken.count === 0) {
    throw new Error("Record missing");
  }

  return true;
};

export const verifyUserInDb = async (email: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return safeUser(user);
};
