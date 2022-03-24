import { appRouter } from "backend/router";
import * as trpcNext from "@trpc/server/adapters/next";
import type { NextApiRequest } from "next";
import { IncomingMessage } from "http";
import { getToken } from "next-auth/jwt"

export const getAccessTokenFromCookie = (
  req: NextApiRequest | IncomingMessage
) => {
  try {
    return (
      req?.headers?.cookie
        ?.split(";")
        .find((val) => val?.includes(process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME as string))
        ?.split("=")[1] ?? null
    );
  } catch (e) {
    return null;
  }
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
  // createContext: ({ req, res }) => {
  //   function getUserFromHeader(req: NextApiRequest) {
  //     try {
  //       // there has two options cookie based or bearer based
  //       const secret = process.env.APP_SECRET_KEY as string;
  //       let token = req.headers?.authorization?.split(" ")[1] ?? null;
  //       if (!token) token = getAccessTokenFromCookie(req);
  //       if (!token) return null;

  //       let payload: JWTPayload = getToken({ token, secret });
  //       return payload?.user;
  //     } catch (e) {
  //       return null;
  //     }
  //   }
  //   const user = getUserFromHeader(req);

  //   return {
  //     user,
  //   };
  // },
});
