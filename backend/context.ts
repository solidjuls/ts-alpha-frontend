import type { NextApiRequest, NextApiResponse } from "next";
import * as trpcNext from "@trpc/server/adapters/next";
import * as trpc from "@trpc/server";
import { IncomingMessage } from "http";
/* @ts-ignore */
import Cookies from "cookies";
/* @ts-ignore */
import jwt from "jsonwebtoken";

export const getAccessTokenFromCookie = (
  req: NextApiRequest | IncomingMessage
) => {
  try {
    return (
      req?.headers?.cookie
        ?.split(";")
        .find((val) =>
          val?.includes(process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME as string)
        )
        ?.split("=")[1] ?? null
    );
  } catch (e) {
    return null;
  }
};

function getUserFromHeader(req: NextApiRequest, res: NextApiResponse) {
  try {
    // there has two options cookie based or bearer based
    const secret = process.env.APP_SECRET_KEY as string;
    const cookies = new Cookies(req, res);
    var token = cookies.get("auth-token");

    if (!token) return null;
    // let token = req.headers["auth-token"]?.split(" ")[1] ?? null;
    // cookies.parse(req.headers.cookie);
    // const token = cookies['auth-token']
    console.log("create context", token);
    // console.log("create context", req.headers.cookie["auth-token"]);
    // if (!token) token = getAccessTokenFromCookie(req);
    // if (!token) return null;

    const payload: JWTPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("jwt.verify", payload);
    // let payload: JWTPayload = getToken({ token, secret });
    return {
      user: {
        mail: payload.mail,
        role: payload.role,
      },
    }; //payload?.user;
  } catch (e) {
    return null;
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  if (!opts) return null;

  const user = getUserFromHeader(opts?.req, opts?.res);

  return {
    user,
    req: opts?.req,
    res: opts?.res,
  };
}
