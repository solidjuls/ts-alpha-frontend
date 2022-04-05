import { appRouter } from "backend/router";
import * as trpcNext from "@trpc/server/adapters/next";
import type { NextApiRequest } from "next";
import { IncomingMessage } from "http";
// import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

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

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: ({ req, res }) => {
    function getUserFromHeader(req: NextApiRequest) {
      try {
        // there has two options cookie based or bearer based
        const secret = process.env.APP_SECRET_KEY as string;
        var cookies = cookie.parse(req.headers.cookie);

        // let token = req.headers["auth-token"]?.split(" ")[1] ?? null;
        // cookies.parse(req.headers.cookie);
        const token = cookies['auth-token']
        console.log("create context", token);
        // console.log("create context", req.headers.cookie["auth-token"]);
        // if (!token) token = getAccessTokenFromCookie(req);
        // if (!token) return null;

        const payload: JWTPayload = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("jwt.verify", payload);
        // let payload: JWTPayload = getToken({ token, secret });
        return  null//payload?.user;
      } catch (e) {
        return null;
      }
    }
    const user = getUserFromHeader(req);

    return {
      user,req, res
    };
  },
});
