import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";

import {
  ACCESS_TOKEN_COOKIE,
  verifyAccessToken,
} from "../utils/jwt.js";

type AuthVariables = {
  prisma: any;
  user_id: string;
};

export const authMiddleware: MiddlewareHandler<{
  Variables: AuthVariables;
}> = async (c, next) => {

  let accessToken = getCookie(
    c,
    ACCESS_TOKEN_COOKIE
  );

  if (!accessToken) {

    const authHeader =
      c.req.header("Authorization");

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      accessToken =
        authHeader.substring(7);
    }
  }

  if (!accessToken) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401
    );
  }

  try {

    const payload =
      await verifyAccessToken(accessToken);

    c.set("user_id", payload.user_id);

    await next();

  } catch {

    return c.json(
      {
        success: false,
        message: "Invalid token",
      },
      401
    );

  }

};