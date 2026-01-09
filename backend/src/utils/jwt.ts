import jwt from "jsonwebtoken";
import { AuthPayload } from "../types";

export const generateTokens = (payload: AuthPayload) => {
  const accessToken = jwt.sign(payload, (process.env.JWT_SECRET || "secret") as string, {
    expiresIn: process.env.JWT_EXPIRY || "15m",
  } as any);

  const refreshToken = jwt.sign(payload, (process.env.JWT_REFRESH_SECRET || "refresh-secret") as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  } as any);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret") as AuthPayload;
  } catch (error) {
    return null;
  }
};
