import { sign, verify } from "hono/jwt";

export type JwtPayload = {
  user_id: string;
};

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "30d";
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

const signJwt = async (
  payload: JwtPayload,
  secret: string,
  expiresIn: number
) => {
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  return await sign({ ...payload, exp }, secret, "HS256");
};

const verifyJwt = async (token: string, secret: string): Promise<JwtPayload> => {
  const payload = await verify(token, secret, "HS256");
  if (typeof payload.user_id !== "string") {
    throw new Error("Invalid token payload");
  }
  return { user_id: payload.user_id };
};

export const generateAccessToken = async (user_id: string) => {
  return await signJwt(
    { user_id },
    getEnv("JWT_ACCESS_SECRET"),
    ACCESS_TOKEN_MAX_AGE_SECONDS
  );
};

export const generateRefreshToken = async (user_id: string) => {
  return await signJwt(
    { user_id },
    getEnv("JWT_REFRESH_SECRET"),
    REFRESH_TOKEN_MAX_AGE_SECONDS
  );
};

export const verifyAccessToken = async (token: string) => {
  return await verifyJwt(token, getEnv("JWT_ACCESS_SECRET"));
};

export const verifyRefreshToken = async (token: string) => {
  return await verifyJwt(token, getEnv("JWT_REFRESH_SECRET"));
};
