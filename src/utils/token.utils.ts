import { randomUUID } from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
  email: string;
};

export const accessTokenExpiresIn =
  process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

export const refreshTokenExpiresIn =
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret";

const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";

const makeOptions = (expiresIn: string): SignOptions => {
  return {
    expiresIn: expiresIn as SignOptions["expiresIn"],
    jwtid: randomUUID(),
  };
};

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, accessTokenSecret, makeOptions(accessTokenExpiresIn));
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, refreshTokenSecret, makeOptions(refreshTokenExpiresIn));
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret) as TokenPayload;
};

export const expiresInToSeconds = (value: string, fallbackSeconds: number) => {
  const number = Number.parseInt(value);

  if (Number.isNaN(number)) {
    return fallbackSeconds;
  }

  if (value.endsWith("m")) {
    return number * 60;
  }

  if (value.endsWith("h")) {
    return number * 60 * 60;
  }

  if (value.endsWith("d")) {
    return number * 24 * 60 * 60;
  }

  if (value.endsWith("w")) {
    return number * 7 * 24 * 60 * 60;
  }

  return number;
};
